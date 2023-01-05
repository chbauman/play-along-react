import { useForm, ValidationError } from "@formspree/react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";

/** Form spree contact form component.
 *
 * Taken from: https://developers.cloudflare.com/pages/tutorials/add-a-react-form-with-formspree/
 */
export default function ContactForm() {
  const [state, handleSubmit] = useForm("xpzbwoql");

  if (state.succeeded) {
    return <p>Thanks for your submission!</p>;
  }

  return (
    <>
      <Row>
        <h4>Contact</h4>
        <p>
          If you have any questions, need assistance, or want to provide us with
          helpful feedback, please don't hesitate to use the following contact
          form. Simply provide your name, email address, and a brief message
          describing your inquiry, and we will get back to you as soon as
          possible.
        </p>
      </Row>
      <Row>
        <Col>
          <Form method="POST" onSubmit={handleSubmit}>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <Form.Control type="text" name="name" id="name"></Form.Control>
            <ValidationError prefix="Name" field="name" errors={state.errors} />

            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Form.Control type="email" name="email" id="email"></Form.Control>
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />

            <FormLabel htmlFor="message">Message</FormLabel>
            <Form.Control
              as="textarea"
              name="message"
              id="message"
            ></Form.Control>
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />

            <Button className="mt-3" type="submit" disabled={state.submitting}>
              Submit
            </Button>
            <ValidationError errors={state.errors} />
          </Form>
        </Col>
      </Row>
    </>
  );
}
