import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { 
  LoginFormWrapper, 
  FormItems, 
  StyledAccordion, 
  StyledFormControl,
  StyledButton,
  FormContainer,
  StyledModal
} from './registerform.styled.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Form } from 'react-bootstrap';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = () => {
  const [getLogin, setLogin] = useState<string>("");
  const [getPass, setPass] = useState<string>("");
  const [getName, setName] = useState<string>("");
  const [getImg, setImg] = useState<File | null>(null);
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setImg(selectedFile || null);
  };

  async function RegButtonClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const formData = new FormData();
    if (getImg) {
      formData.append('file', getImg);
    }

    formData.append('Login', getLogin);
    formData.append('Password', getPass);
    formData.append('FullName', getName);

    try {
      const response = await axios.post(
        'https://azureuserswebapiblobs20241111171225.azurewebsites.net/api/Users/register', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log(response.data);
      setModalMessage("Registration successful");
      setShow(true);
      
      setLogin("");
      setPass("");
      setName("");
      setImg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setModalMessage("An error occurred during registration: " + error.message);
        console.log(error.message);

      } else {
        setModalMessage("An error occurred during registration.");
      }
      setShow(true);
    }
  }

  const handleClose = () => setShow(false);

  return (
    <LoginFormWrapper>
      <FormContainer>
        <StyledAccordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Register</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={RegButtonClick}>
                <FormItems>
                  <Form.Group>
                    <Form.Label>Login</Form.Label>
                    <StyledFormControl
                      type="text"
                      placeholder="Your login"
                      value={getLogin}
                      onChange={(e) => setLogin(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <StyledFormControl
                      type="password"
                      placeholder="Your password"
                      value={getPass}
                      onChange={(e) => setPass(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Full name</Form.Label>
                    <StyledFormControl
                      type="text"
                      placeholder="Your full name"
                      value={getName}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Upload your avatar</Form.Label>
                    <StyledFormControl
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Form.Group>

                  <StyledButton variant="success" type="submit">
                    Register
                  </StyledButton>
                </FormItems>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </StyledAccordion>
      </FormContainer>




      

      <StyledModal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <StyledButton variant="secondary" onClick={handleClose}>
            Close
          </StyledButton>
        </Modal.Footer>
      </StyledModal>
    </LoginFormWrapper>
  );
};

export default RegisterForm;
