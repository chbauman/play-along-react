import ContactForm from "./Contact";
import { wrapWithNav } from "./NavBar";

export const Help = () => {
  const contact = <ContactForm />;
  return wrapWithNav(contact, "Help");
};
