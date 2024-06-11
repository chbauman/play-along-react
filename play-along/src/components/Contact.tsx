import { useForm, ValidationError } from "@formspree/react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

/** Form spree contact form component.
 *
 * Taken from: https://developers.cloudflare.com/pages/tutorials/add-a-react-form-with-formspree/
 */
export default function ContactForm() {
  const [state, handleSubmit] = useForm("xpzbwoql");
  const { t } = useTranslation();

  if (state.succeeded) {
    return <p>Thanks for your submission!</p>;
  }

  return (
    <>
      <Row>
        <h4>{t("contact")}</h4>
        <p>{t("contactTxt")}</p>
      </Row>
      <Row>
        <Col>
          <Form method="POST" onSubmit={handleSubmit}>
            <FormLabel htmlFor="name">{t("fullName")}</FormLabel>
            <Form.Control type="text" name="name" id="name"></Form.Control>
            <ValidationError prefix="Name" field="name" errors={state.errors} />

            <FormLabel htmlFor="email">{t("email")}</FormLabel>
            <Form.Control type="email" name="email" id="email"></Form.Control>
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />

            <FormLabel htmlFor="message">{t("message")}</FormLabel>
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
              {t("submit")}
            </Button>
            <ValidationError errors={state.errors} />
          </Form>
        </Col>
      </Row>
    </>
  );
}
