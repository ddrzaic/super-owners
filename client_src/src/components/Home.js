import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";



class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sign_in_email: "",
            sign_in_password: "",
            sign_up_email: "",
            sign_up_password: "",
            confirm_password: "",
            isLoggedIn: localStorage.getItem('token')
        }
    }

    componentDidMount() {

    }

    validateLoginForm() {
        return this.state.sign_in_email.length > 0 && this.state.sign_in_password.length > 0;
    }
    validateRegisterForm() {
        return this.state.sign_up_email.length > 0 && this.state.sign_up_password.length > 0 && this.state.confirm_password.length > 0;
    }

    submitLogin(event) {
        event.preventDefault();
        let loginUser = {
            email: this.state.sign_in_email,
            password: this.state.sign_in_password
        }
        axios.request({
            method: 'post',
            url: 'http://localhost:3000/users/login',
            data: loginUser
        }).then(response => {
            console.log(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_email', loginUser.email);
            const event = new Event('userChanged');
            document.dispatchEvent(event);
            this.props.history.replace('/owners', null);

        }).catch(err => {
            console.log(err);
            if (err.response.status === 422) {
                this.setState({ sign_in_email: this.state.sign_in_email, sign_in_password: "" }, () => {
                    alert("Wrong username or password!");
                });
            }
        });

    }
    submitRegister(event) {
        event.preventDefault();
        if (this.state.sign_up_password === this.state.confirm_password) {
            let registerUser = {
                email: this.state.sign_up_email,
                password: this.state.sign_up_password
            }
            axios.request({
                method: 'post',
                url: 'http://localhost:3000/signup',
                data: registerUser
            }).then(response => {
                this.setState({ sign_in_email: registerUser.email, sign_in_password: registerUser.password }, () => {
                    this.submitLogin(new Event("register"));
                });
            }).catch(err => {
                console.log(err)
                if (err.response.status === 500) {
                    alert("User already exists!");
                }
            });


        } else {
            this.setState({
                sign_up_password: "",
                confirm_password: ""
            })
            alert("Passwords do not match");
        }
    }

    render() {
        if (this.state.isLoggedIn !== null) {
            return <Redirect to="/owners" />
        }
        return (
            <div className="form-container">

                <div className="login-container">
                    <h4>Sign in</h4>
                    <br></br>

                    <Form onSubmit={e => { this.submitLogin(e) }}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                value={this.state.sign_in_email}
                                onChange={(e) => this.setState({ sign_in_email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.sign_in_password}
                                onChange={(e) => this.setState({ sign_in_password: e.target.value })}
                            />
                        </Form.Group>
                        <Button className="button" size="lg" type="submit" disabled={!this.validateLoginForm()}>
                            Login
                        </Button>
                    </Form>
                </div>
                <div className="login-container">
                    <h4>Sign up</h4>
                    <br></br>
                    <Form onSubmit={e => { this.submitRegister(e) }}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={this.state.sign_up_email}
                                onChange={(e) => this.setState({ sign_up_email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.sign_up_password}
                                onChange={(e) => this.setState({ sign_up_password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.confirm_password}
                                onChange={(e) => this.setState({ confirm_password: e.target.value })}
                            />
                        </Form.Group>
                        <Button className="button" size="lg" type="submit" disabled={!this.validateRegisterForm()}>
                            Register
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Home;