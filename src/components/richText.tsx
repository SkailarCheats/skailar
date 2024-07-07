import Link from 'next/link';
import { buttonVariants } from './ui/button';

import React from 'react';

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
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline"
                    >
                        {renderRichText(node.children || [])}
                    </Link>
                );

            default:
                return node.text ? <span key={index} className="text-base">{node.text}</span> : <br />;
        }
    });
};

export default renderRichText;
