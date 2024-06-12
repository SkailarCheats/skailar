import Link from 'next/link';
import { buttonVariants } from './ui/button';

export interface RichTextNode {
    type?: string;
    text?: string;
    url?: string;
    newTab?: boolean;
    children?: RichTextNode[];
}

const renderRichText = (richText: RichTextNode[]) => {
    return richText.map((node, index) => {
        switch (node.type) {
            case 'h6':
                return <h6 key={index} className="text-lg font-semibold">{renderRichText(node.children || [])}</h6>;
            case 'h4':
                return <h4 key={index} className="text-xl font-bold">{renderRichText(node.children || [])}</h4>;
            case 'ul':
                return <ul key={index} className="list-disc list-inside">{renderRichText(node.children || [])}</ul>;
            case 'li':
                return <li key={index} className="ml-4">{renderRichText(node.children || [])}</li>;
            case 'link':
                return (
                    <Link
                        key={index}
                        href={`${node.url}`}
                        target={node.newTab ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: 'link', className: '-ml-3' })}
                    >
                        {renderRichText(node.children || [])}
                    </Link>
                );
            default:
                return node.text ? <span key={index} className="text-base">{node.text}</span> : null;
        }
    });
};

export default renderRichText;
