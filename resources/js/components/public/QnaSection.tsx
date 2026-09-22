import { useState } from 'react';
import type { FaqItem } from '@/types/public';

interface Props {
    faqs: FaqItem[];
}

export default function QnaSection({ faqs }: Props) {
    const defaultOpen = faqs.find((f) => f.is_open_by_default)?.id ?? faqs[0]?.id ?? null;
    const [openId, setOpenId] = useState<number | null>(defaultOpen);

    return (
        <section className="section" id="qna">
            <div className="wrap">
                <div className="eyebrow" data-reveal>
                    QnA
                </div>
                <h2 data-reveal>Pertanyaan yang sering masuk.</h2>
                <div style={{ height: 28 }} />

                <div className="qna-wrap" data-reveal>
                    {faqs.map((faq) => {
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
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: faq.answer ?? 'Jawaban segera ditambahkan.',
                                            }}
                                        />
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
