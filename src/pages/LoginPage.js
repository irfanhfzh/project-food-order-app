import { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { setAuth } from "../bootstrap/actions";
import { useDispatch, useSelector } from "react-redux";
import produce from "immer";
import api from "../bootstrap/apis";
import Logo from "../assets/images/header_logo.png";
import InputForm from "../components/InputForm";
import "./style/LoginPage.css";

const LoginPage = () => {
  const { username } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    values: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    error: "",
  });

  const inputs = [
    {
      key: 1,
      id: "formUsername",
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "Masukan Username",
      pattern: "^[A-za-z0-9]{3,16}$",
      errMessage:
        "Username harus memiliki 3-16 Karakter dan Tidak boleh menyertakan Simbol",
    },
    {
      key: 2,
      id: "formPassword",
      label: "Password",
      name: "password",
      type: "text",
      placeholder: "Masukan Password",
      errMessage:
        "Password harus memiliki minimal 8 Karakter dan Setidaknya terdapat 1 Huruf Kecil, 1 Huruf Besar, 1 Angka dan 1 Simbol",
    },
    {
      key: 3,
      id: "formConfirmPassword",
      label: "Confirm Password",
      name: "confirmPassword",
      type: "text",
      placeholder: "Confirm Password",
      pattern: state.values.password,
      errMessage: "Password tidak sama seperti yang diatas",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.post("/login", state.values);
      dispatch(
        setAuth({
          access_token: result.data.access_token,
          username: state.values.username
        })
      );
    } catch (e) {
      if (e.response.status === 401) {
        setState(
          produce((draft) => {
            draft.error = "Akun tidak terdaftar!";
          })
        );
      } else {
        alert("Terjadi kesalahan. silahkan coba lagi")
      }
    }
  };

  const onChange = (e) => {
    setState(
      produce((draft) => {
        draft.values[e.target.name] = e.target.value;
      })
    );
  };

  if (username) return <Navigate to="/" replace />

  return (
    <div className="login-page min-vh-100">
      <Row>
        <Col md={6}>
          <div className="bg-img min-vh-100"></div>
        </Col>
        <Col md={6} className="m-auto px-5">
          <div>
            <Image src={Logo} alt="Logo Warunk Horizontal" />
            <h1 className="mt-4">Selamat Datang!!!</h1>
            <p className="mt-3 mb-0">
              Silahkan Masuk ke Akun Anda untuk Melanjutkan...
            </p>
          </div>
          <div>
            <Form className="my-3" autoComplete="off" onSubmit={handleSubmit}>
              <p className="text-danger my-0 mb-2">{state.error}</p>
              {inputs.map((input) => (
                <InputForm
                  key={input.key}
                  {...input}
                  value={state.values[input.name]}
                  onChange={onChange}
                />
              ))}
              <Form.Group className="my-3" controlId="formCheckbox">
                <Form.Check type="checkbox" label="Remember Me" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Masuk
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
