import { useTranslation } from "react-i18next";
import ContactForm from "./Contact";
import { wrapWithNav } from "./NavBar";

export const Help = () => {
  const contact = <ContactForm />;
  const { t } = useTranslation();
  return wrapWithNav(contact, t("helpTitle"));
};
