import ContactForm from "./contact-form";

const ContactPage = () => {
  return (
    <div className="flex flex-col gap-8 py-8 justify-center items-center">
      <h1 className="h1-bold">Contactez-nous !</h1>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
