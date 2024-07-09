import { useState } from "react";
import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first: contact?.first || "",
    last: contact?.last || "",
    twitter: contact?.twitter || "",
    avatar: contact?.avatar || "",
    notes: contact?.notes || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.first) newErrors.first = "First name is required";
    if (!formData.last) newErrors.last = "Last name is required";
    if (!formData.twitter) newErrors.twitter = "Twitter handle is required";
    if (
      formData.avatar &&
      !/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(formData.avatar)
    )
      newErrors.avatar = "Avatar URL must be a valid image URL";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Submit the form
      await updateContact(contact.id, formData);
      navigate(`/contacts/${contact.id}`);
    }
  };

  return (
    <Form method="post" id="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          value={formData.first}
          onChange={handleChange}
        />
      </label>
      {errors.first && <span className="error">{errors.first}</span>}
      <label>
        <span>Surname</span>
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          value={formData.last}
          onChange={handleChange}
        />
      </label>{" "}
      {errors.last && <span className="error">{errors.last}</span>}
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          value={formData.twitter}
          onChange={handleChange}
        />
      </label>{" "}
      {errors.twitter && <span className="error">{errors.twitter}</span>}
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
        />
      </label>{" "}
      {errors.avatar && <span className="error">{errors.avatar}</span>}
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
