import { useState } from "react";

const faqs = [
  { question: "What is Nerve AI?", answer: "Nerve AI is an advanced AI-powered assistant designed to help users with various queries efficiently." },
  { question: "How do I sign up for Nerve AI?", answer: "You can sign up by visiting our website and following the registration process." },
  { question: "What types of questions can I ask Nerve AI?", answer: "You can ask about a variety of topics, including technology, business, and general inquiries." },
  { question: "Is Nerve AI available for free?", answer: "Yes, Nerve AI offers a free version with limited features. Premium plans provide additional benefits." },
  { question: "How accurate are the answers provided by Nerve AI?", answer: "Nerve AI uses advanced machine learning algorithms to ensure high accuracy, but responses may vary." },
  { question: "Can I use Nerve AI offline?", answer: "Currently, Nerve AI requires an internet connection to function." },
  { question: "How does Nerve AI protect my privacy?", answer: "Nerve AI follows strict data protection protocols and does not store personal queries." },
  { question: "What platforms is Nerve AI available on?", answer: "Nerve AI is available on web browsers, iOS, and Android." },
  { question: "How do I upgrade to the premium version?", answer: "You can upgrade through the settings section on our website or mobile app." },
  { question: "Who can I contact for support?", answer: "You can reach our support team via email or live chat on our website." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Quick Answers To Common Queries</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-300 rounded-lg p-4 shadow-sm transition-all duration-300 bg-white"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="text-lg font-medium text-gray-700 hover:text-green-600">
                  {faq.question}
                </span>
                <span className="text-xl ml-4 text-gray-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              
              <div
                id={`faq-content-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "h-auto opacity-100" : "h-0 opacity-0"}`}
              >
                <p className="pt-2 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
