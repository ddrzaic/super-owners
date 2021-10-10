import React, { Component } from 'react';
import axios from 'axios';
import OwnerItem from './OwnerItem';





class Owners extends Component {

    constructor() {
        super();
        this.state = {
            owners: [],
            searchValue: sessionStorage.getItem('search') || '',
            page: sessionStorage.getItem('page') || 1,
            ownerCount: sessionStorage.getItem('count') || [{ count: 50 }],
            continent: sessionStorage.getItem('cont') || '',
            younger_than: sessionStorage.getItem('younger') || 150,
            older_than: sessionStorage.getItem('older') || 0,
        }
        this.searchChange = this.searchChange.bind(this);
        this.ownerGetLimit = 30;
    }

    componentDidMount() {
        this.getOwners();
    }

    getOwners() {
        let getConfig = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
        axios.get(`http://localhost:3000/owners/count?name=${this.state.searchValue}&older_than=${this.state.older_than}&younger_than=${this.state.younger_than}&continent=${this.state.continent}`, getConfig)
            .then(response => {
                this.setState(
                    {
                        ownerCount: response.data.filter(x => x !== undefined).shift()
                    }, () => {
                        sessionStorage.setItem('count', this.state.ownerCount);
                        sessionStorage.setItem('search', this.state.searchValue);
                    }
                );
            }).catch(err => {
                if (err.response.status === 401) {
                   this.props.history.replace("/", null);
                }
                console.log(err);
            });

        let offset = this.state.page * this.ownerGetLimit - this.ownerGetLimit;
        axios.get(`http://localhost:3000/owners?name=${this.state.searchValue}&limit=${this.ownerGetLimit}&offset=${offset}&older_than=${this.state.older_than}&younger_than=${this.state.younger_than}&continent=${this.state.continent}`, getConfig)
            .then(response => {
                this.setState({ owners: response.data }, () => {
                    console.log(this.state)
                })
            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.replace("/", null);
                }

                console.log(err);
            });
    }

    searchChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    setUser = user => {
        this.setState({ user: user });
    }


    setPage(pageNum) {
        this.setState({ page: Number(pageNum) }, () => {
            this.getOwners();
            sessionStorage.setItem('page', pageNum);
        });

    }
    nextPage() {
        let currentPage = this.state.page;
        let maxPage = this.state.ownerCount.count / 50;
        if (currentPage < maxPage) {
            this.setState({ page: (Number(currentPage) + 1) }, () => {
                this.getOwners();
                sessionStorage.setItem('page', (currentPage + 1));
            });
        }

    }
    prevPage() {
        let currentPage = this.state.page;
        if (currentPage > 1) {
            this.setState({ page: (Number(currentPage) - 1) }, () => {
                this.getOwners();
                sessionStorage.setItem('page', (currentPage - 1));
            });
        }
    }
    selectContinent(continent) {
        this.setState({ continent: continent, page: 1 }, () => {
            this.getOwners();
            sessionStorage.setItem('cont', continent);
        })
    }
    selectAgeRange(lowerBound) {
        if (lowerBound === 0) {
            this.setState({ older_than: 0, younger_than: 150, page: 1 }, () => {
                this.getOwners();
                sessionStorage.setItem('older', 0);
                sessionStorage.setItem('younger', 150);
            })
        }
        else if (lowerBound === 45) {
            this.setState({ older_than: 45, younger_than: 150, page: 1 }, () => {
                this.getOwners();
                sessionStorage.setItem('older', 45);
                sessionStorage.setItem('younger', 150);
            })
        }
        else {
            this.setState({ older_than: lowerBound, younger_than: lowerBound + 5, page: 1 }, () => {
                this.getOwners();
                sessionStorage.setItem('older', lowerBound);
                sessionStorage.setItem('younger', lowerBound + 5);
            })
        }
    }

    render() {
        let ownerItems = this.state.owners.map((owner, i) => {
            return (
                <OwnerItem key={owner.owner_id} item={owner} />
            )
        })
        const pages = [];
        if (this.state.owners.length === 0) {
            ownerItems.push(<li className="collection-item" id="owner-li" key="noOwners">
                No owners found!
            </li>);
        }


        for (let i = 0; i < this.state.ownerCount.count / parseFloat(this.ownerGetLimit); i++) {
            pages.push(<li className={Number(this.state.page) === i + 1 ? "active" : ""} key={i} onClick={() => this.setPage(Number(i + 1))}><a href="#!">{i + 1}</a></li>);
        }
        return (
            <div>
                <h1>Owners</h1>
                <div className="nav-wrapper">
                    <form>
                        <div className="input-field" id="search-input">
                            <textarea id="textarea1" placeholder="Search" className="materialize-textarea search-bar" value={this.state.searchValue} onChange={this.searchChange} onKeyPress={
                                event => {
                                    if (event.key === 'Enter') {
                                        this.setState({ page: 1 }, () => {
                                            sessionStorage.setItem('page', 1);
                                            event.preventDefault();
                                            this.getOwners();
                                        });
                                    }
                                }
                            }></textarea>
                            <label htmlFor="textarea1"></label>
                            <i className="fas fa-search fa-sm" onClick={() => {
                                this.setState({ page: 1 }, () => {
                                    sessionStorage.setItem('page', 1);
                                    this.getOwners();
                                });
                            }}></i>
                        </div>
                        <a id="button" className='dropdown-trigger btn dropdown-filter' href='#!' data-target='dropcontinent'>{this.state.continent === '' ? "Continent" : this.state.continent} <p className="fa fa-angle-down"></p></a>
                        <ul id='dropcontinent' className='dropdown-content'>
                            <li onClick={() => this.selectContinent("")}>-</li>
                            <li onClick={() => this.selectContinent("Africa")}>Africa</li>
                            <li onClick={() => this.selectContinent("Anctarctica")}>Antarctica</li>
                            <li onClick={() => this.selectContinent("Asia")}>Asia</li>
                            <li onClick={() => this.selectContinent("Europe")}>Europe</li>
                            <li onClick={() => this.selectContinent("North America")}>North America</li>
                            <li onClick={() => this.selectContinent("Oceania")}>Oceania</li>
                            <li onClick={() => this.selectContinent("South America")}>South America</li>
                        </ul>
                        <a id="button" className='dropdown-trigger btn dropdown-filter' href='#!' data-target='dropage'>{this.state.older_than === 0 ? "Age range" : this.state.older_than + " - " + this.state.younger_than} <p className="fa fa-angle-down"></p></a>
                        <ul id='dropage' className='dropdown-content'>
                            <li onClick={() => this.selectAgeRange(0)}>-</li>
                            <li onClick={() => this.selectAgeRange(15)}>15-20</li>
                            <li onClick={() => this.selectAgeRange(20)}>20-25</li>
                            <li onClick={() => this.selectAgeRange(25)}>25-30</li>
                            <li onClick={() => this.selectAgeRange(30)}>30-35</li>
                            <li onClick={() => this.selectAgeRange(35)}>35-40</li>
                            <li onClick={() => this.selectAgeRange(40)}>40-45</li>
                            <li onClick={() => this.selectAgeRange(45)}>45+</li>
                        </ul>
                    </form>
                </div>
                <div id="content">
                    <ul className="collection" id="owners">
                        {ownerItems}
                    </ul>
                </div>
                <div className="footer">
                    <ul className="pagination" id="pagination">
                        <li className="waves-effect"><a href="#!"><i className="fa fa-chevron-left" onClick={() => this.prevPage()}></i></a></li>
                        {pages}
                        <li className="waves-effect"><a href="#!"><i className="fa fa-chevron-right" onClick={() => this.nextPage()}></i></a></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Owners;