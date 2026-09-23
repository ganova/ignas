import { useState } from 'react';
import type { FaqItem } from '@/types/public';

interface Props {
    faqs: FaqItem[];
}

export default function QnaSection({ faqs }: Props) {
    // A question without a real answer isn't ready for visitors yet — showing
    // a "coming soon" placeholder reads as an unfinished site, so it's held
    // back here until an admin fills it in, rather than filtered server-side
    // (the admin list still needs to show every question, answered or not).
    const answered = faqs.filter((f) => f.answer && f.answer.trim().length > 0);
    const defaultOpen = answered.find((f) => f.is_open_by_default)?.id ?? answered[0]?.id ?? null;
    const [openId, setOpenId] = useState<number | null>(defaultOpen);

    if (answered.length === 0) return null;

    return (
        <section className="section" id="qna">
            <div className="wrap">
                <div className="eyebrow" data-reveal>
                    FAQ
                </div>
                <h2 data-reveal>Questions I get a lot.</h2>
                <div style={{ height: 28 }} />

                <div className="qna-wrap" data-reveal>
                    {answered.map((faq) => {
                        const isOpen = openId === faq.id;
                        const panelId = `qna-panel-${faq.id}`;
                        const buttonId = `qna-button-${faq.id}`;

                        return (
                            <div className={`qna-item ${isOpen ? 'open' : ''}`} key={faq.id}>
                                <h3 className="qna-heading">
                                    <button
                                        type="button"
                                        className="qna-question"
                                        id={buttonId}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                                    >
                                        <span>{faq.question}</span>
                                        <i className="qna-icon" aria-hidden="true">
                                            +
                                        </i>
                                    </button>
                                </h3>
                                <div
                                    className="qna-answer"
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    aria-hidden={!isOpen}
                                >
                                    <div className="qna-answer-inner">
                                        {/* Answer HTML is sanitized server-side (TextSanitizer) before storage. */}
                                        <p dangerouslySetInnerHTML={{ __html: faq.answer as string }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
