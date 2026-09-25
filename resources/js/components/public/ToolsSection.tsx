import type { ToolItem } from '@/types/public';

function initials(name: string): string {
    const words = name.split(/\s+/).filter(Boolean);
    return (words.length > 1 ? (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '') : name.slice(0, 2)).toUpperCase();
}

export default function ToolsSection({ tools }: { tools: ToolItem[] }) {
    if (tools.length === 0) return null;

    return (
        <section className="section tools-section" id="tools">
            <div className="wrap">
                <div className="eyebrow" data-reveal>
                    Software Expertise
                </div>
                <h2 data-reveal>The tools behind the cut.</h2>
                <div style={{ height: 14 }} />
                <ul className="tools-grid" data-reveal data-reveal-stagger>
                    {tools.map((tool, index) => (
                        <li className="tool-chip" key={tool.id} style={{ transitionDelay: `${index * 60}ms` }}>
                            <span className="tool-icon" aria-hidden="true">
                                {tool.icon_url ? <img src={tool.icon_url} alt="" loading="lazy" /> : initials(tool.name)}
                            </span>
                            <span className="tool-text">
                                <b>{tool.name}</b>
                                {tool.category && <i>{tool.category}</i>}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
