import { useForm } from '@inertiajs/react';

export default function ContactForm() {
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
        name: '',
        email: '',
        whatsapp: '',
        message: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form className="contact-form" onSubmit={submit}>
            <div className="contact-form-row">
                <div className="contact-field">
                    <label htmlFor="contact-name">Name</label>
                    <input
                        id="contact-name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <span className="contact-error">{errors.name}</span>}
                </div>
                <div className="contact-field">
                    <label htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <span className="contact-error">{errors.email}</span>}
                </div>
            </div>

            <div className="contact-field">
                <label htmlFor="contact-whatsapp">WhatsApp (optional)</label>
                <input
                    id="contact-whatsapp"
                    type="text"
                    value={data.whatsapp}
                    onChange={(e) => setData('whatsapp', e.target.value)}
                />
            </div>

            <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                    id="contact-message"
                    rows={4}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    required
                />
                {errors.message && <span className="contact-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn-dark" disabled={processing}>
                {processing ? 'Sending…' : 'Send Message'}
            </button>

            {wasSuccessful && <p className="contact-success">Thanks! I&apos;ll get back to you soon.</p>}
        </form>
    );
}
