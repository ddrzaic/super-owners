import React, { Component } from "react";
import axios from "axios";
import dateFormat from 'dateformat';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class OwnerDetails extends Component {


    constructor(props) {
        super(props);
        this.state = {
            details: [],
            cars: [],
            country: '',
            comments: [],
            commentCount: 0,
            newComment: "",
            editComment: "",
            idCommentEdit: -1,
            user_email: localStorage.getItem('user_email'),
            getCommentSkip: 0,
        }
        this.axiosConfig = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
        this.ownerId = this.props.match.params.id;
        this.getCommentCount = 5;

    }

    componentDidMount() {
        this.getOwnerDetails();
    }

    getComments() {
        axios.get(`http://localhost:3000/owners/${this.ownerId}/comments/count`, this.axiosConfig)
            .then(response => {
                this.setState({ commentCount: response.data })
            });


        axios.get(`http://localhost:3000/owners/${this.ownerId}/comments?filter[limit]=${this.getCommentCount}&filter[skip]=${this.state.getCommentSkip}&filter[order]=datetime%20DESC`, this.axiosConfig)
            .then(response => {
                let updatedComments = this.state.comments;
                for (let i = 0; i < response.data.length; i++) {
                    updatedComments.push(response.data[i]);
                }
                this.setState({ comments: updatedComments });
            });
    }
    getOwnerDetails() {
        axios.get(`http://localhost:3000/owners/${this.ownerId}?filter[include][]=country&filter[include][]=cars`, this.axiosConfig)
            .then(response => {
                this.setState({ details: response.data, cars: response.data.cars, country: response.data.country }, () => {

                })
            })
            .catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push("/");
                }
                console.log(err);
            });

        this.getComments();
    }
    validateCommentForm(str) {
        return str.length > 0;
    }

    addComment(event) {
        event.preventDefault();
        let newCommentParams = {
            comment_content: this.state.newComment,
        }

        console.log(newCommentParams);
        axios.post(`http://localhost:3000/owners/${this.ownerId}/comments`, newCommentParams, this.axiosConfig).then(response => {
            let updatedComments = [];
            updatedComments.push(response.data);
            for (let i = 0; i < this.state.comments.length; i++) {
                updatedComments.push(this.state.comments[i]);
            }


            this.setState({ newComment: "", comments: updatedComments }, () => {
                console.log(response.data);
            });

        }).catch(err => {
            console.log(err);
        });

        this.setState({ idCommentEdit: -1, commentCount: this.state.commentCount + 1, getCommentSkip: this.state.getCommentSkip + 1 });

    }
    deleteComment(id) {
        axios.delete(`http://localhost:3000/comments/${id}`, this.axiosConfig).then(response => {
            this.setState({
                comments: this.state.comments.filter(function (comment) {
                    if (comment.id === id) {
                        return false;
                    }
                    return true;
                })
                , commentCount: this.state.commentCount - 1, getCommentSkip: this.state.getCommentSkip - 1
            });
        }).catch(err => {
            console.log(err);
        });
    }

    toggleEditComment(comment) {
        this.setState({ idCommentEdit: comment.id, editComment: comment.comment_content }, () => {

        });
    }

    editComment(event) {
        event.preventDefault();
        let newCommentParams = {
            comment_content: this.state.editComment,
        }
        axios.patch(`http://localhost:3000/comments/${this.state.idCommentEdit}`, newCommentParams, this.axiosConfig)
            .then(response => {
                let id = this.state.idCommentEdit;
                this.setState({
                    idCommentEdit: -1, editComment: "", comments: this.state.comments.filter(function (comment) {
                        if (comment.id === id) {
                            comment.comment_content = newCommentParams.comment_content;
                        }
                        return true;
                    })
                });

            }).catch(err => {
                console.log(err);
            });
    }

    loadMore() {
        this.setState({ getCommentSkip: this.state.getCommentSkip + 5 }, () => {
            console.log("Skip first: " + this.state.getCommentSkip);
            this.getComments();
        });
    }

    render() {

        let newCommentForm = (
            <div className="add-comment-div" key="newcomment">
                <h5>Add comment</h5>
                <Form className="new-comment-form" onSubmit={e => { this.addComment(e) }}>
                    <Form.Group size="lg" controlId="comment">

                        <Form.Control className="form-textarea"
                            as="textarea" style={{ height: '80px' }}
                            value={this.state.newComment}
                            onChange={(e) => this.setState({ newComment: e.target.value })}
                        />
                    </Form.Group>
                    <Button className="button" size="lg" type="submit" disabled={!this.validateCommentForm(this.state.newComment)}>
                        Add
                    </Button>
                </Form>
            </div>
        );

        let editCommentForm = (
            <Form className="new-comment-form" onSubmit={e => { this.editComment(e) }}>
                <Form.Group size="lg" controlId="comment">
                    <Form.Control className="form-textarea"
                        as="textarea" style={{ height: '80px' }}
                        value={this.state.editComment}
                        onChange={(e) => this.setState({ editComment: e.target.value })}
                    />
                </Form.Group>
                <Button className="button" size="lg" type="submit" disabled={!this.validateCommentForm(this.state.editComment)}>
                    Confirm
                </Button>
                <Button className="button" size="lg" onClick={() => {
                    this.setState({ idCommentEdit: -1, editComment: "" })
                }}>
                    Cancel
                </Button>
            </Form>
        );

        let loadMoreButton = [];
        if (this.state.getCommentSkip + 5 < this.state.commentCount) {
            loadMoreButton.push(<Button key="loadMoreButton" className="button" size="sm" onClick={
                () => this.loadMore()}> Load more comments </Button>);
        }

        let commentSection = [];
        if (typeof (this.state.comments) !== 'undefined' && this.state.comments.length > 0) {
            commentSection = this.state.comments.map(function (comment, i) {
                if (comment.email !== this.state.user_email) {
                    return (
                        <li className="collection-item" key={'comment' + i} id="comment">
                            <div className="comment-metadata">
                                <p>{comment.email}</p>
                                <p><i className="fa fa-calendar"></i> {dateFormat(comment.datetime, "mmmm dS, yyyy")} <i className="fa fa-clock"></i> {dateFormat(comment.datetime, "HH:MM")}</p>
                            </div>
                            <p key={'comment_content' + i} id="comment-content">{comment.comment_content}</p>
                        </li>
                    )

                } else
                    if (this.state.idCommentEdit === comment.id) {
                        return editCommentForm;
                    } else {
                        return (

                            <li className="collection-item" key={'comment' + i} id="comment">
                                <div className="comment-metadata">
                                    <p>{comment.email}</p>
                                    <p><i className="fa fa-calendar"></i> {dateFormat(comment.datetime, "mmmm dS, yyyy")} <i className="fa fa-clock"></i> {dateFormat(comment.datetime, "HH:MM")}</p>
                                </div>
                                <p key={'comment_content' + i} id="comment-content">{comment.comment_content}</p>
                                <div className="comment-actions">
                                    <i className="fa fa-trash" onClick={() => this.deleteComment(comment.id)}></i>
                                    <i className="fa fa-pencil" onClick={() => this.toggleEditComment(comment)}></i>
                                </div>
                            </li>
                        )
                    }

            }, this)
        }
        else {
            commentSection.push(
                <li className="collection-item" key="nocoment" id="comment">
                    <p>No comments.</p>
                </li>
            )
        }

        return (
            <div>
                <br />

                <h1>{this.state.details.first_name} {this.state.details.last_name}</h1>
                <ul id="owner-details">
                    <li>Country: {this.state.country.countryName}</li>
                    <li>Continent: {this.state.country.continent}</li>
                    <li>Age: {this.state.details.age}</li>
                </ul>

                <div className="car-collection">
                    <h4>Car collection: </h4>
                    <ul className="collection" id="car-collection-ul">
                        {
                            this.state.cars.map(function (car, i) {
                                return (
                                    <li className="collection-item car-collection" key={'car' + i} id="car-item">
                                        <h5>{car.make} {car.model}</h5>
                                        <p key={'modelyear' + i}>Model year: {car.modelYear}</p>
                                        <p key={'worth' + i}>Worth: {car.price} EUR</p>
                                        <p key={'color' + i}>Color: {car.color}</p>
                                        <p key={'plate' + i}>Licence plate: {car.licencePlate}</p>

                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <br></br>
                {newCommentForm}
                <div className="comment-section">
                    <h5>Comments: </h5>
                    <ul className="collection">
                        {commentSection}
                    </ul>
                </div>
                {loadMoreButton}
            </div>
        )
    }
}

export default OwnerDetails;