import React, { FC, useState } from 'react';
import { 
   LoginFormWrapper, 
  FormItems, 
  StyledAccordion, 
  StyledFormControl,
  StyledButton,
  FormContainer,
  StyledModal
} from './LoginForm.styled.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';


interface accountData{
   avatar:string,
   fullName : string, 
   login: string
}

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {

  const [getLogin, setLogin] = useState<string>("");
  const [getPass, setPass] = useState<string>("");
  const [show, setShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [LoginAcc, setLoginAcc] = useState(" You are not logged in");
  const [imgAcc, setimgAcc] = useState("https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=");

  const handleClose = () => setShow(false);


  async function RegButtonClick(event: React.FormEvent<HTMLFormElement>) {
   event.preventDefault();
   
   const formData = new FormData();
   

   formData.append('Login', getLogin);
   formData.append('Password', getPass);
   

   try {
     const response = await axios.post(
       'https://azureuserswebapiblobs20241111171225.azurewebsites.net/api/Users/login', 
       formData,
       {
         headers: {
           'Content-Type': 'multipart/form-data',
         }
       }
     );
     
     console.log(response.data);
     const account =  response.data as accountData;

     if (account) {
      setLoginAcc(account.login);
      setimgAcc(account.avatar);
    }
     
     setModalMessage("Login successful");
     setShow(true);
     
     setLogin("");
     setPass("");

   } catch (error) {
     if (axios.isAxiosError(error)) {
       setModalMessage("An error occurred during registration: " + error.message);
     } else {
       setModalMessage("An error occurred during registration.");
     }
     setShow(true);
   }};
 
   return(
      <LoginFormWrapper>

      <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={imgAcc} />
            <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
                 {LoginAcc}
            </Card.Text>
            </Card.Body>
         </Card>

         <FormContainer>
         <StyledAccordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
               <Accordion.Header>Sign in</Accordion.Header>
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
                     <StyledButton variant="primary" type="submit">
                     Login
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
export default LoginForm;
