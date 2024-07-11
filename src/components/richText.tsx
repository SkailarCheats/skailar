import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export interface RichTextNode {
    type?: string;
    text?: string;
    url?: string;
    newTab?: boolean;
    children?: RichTextNode[];
}

const renderRichText = (richText: RichTextNode[]): React.ReactNode => {
    return richText.map((node, index) => {
        switch (node.type) {
            case 'h1':
                return <h1 key={index} className="text-4xl font-bold mb-4 mt-6">{renderRichText(node.children || [])}</h1>;
            case 'h2':
                return <h2 key={index} className="text-3xl font-bold mb-3 mt-5">{renderRichText(node.children || [])}</h2>;
            case 'h3':
                return <h3 key={index} className="text-2xl font-bold mb-3 mt-4">{renderRichText(node.children || [])}</h3>;
            case 'h4':
                return <h4 key={index} className="text-xl font-bold mb-2 mt-3">{renderRichText(node.children || [])}</h4>;
            case 'h5':
                return <h5 key={index} className="text-lg font-bold mb-2 mt-2">{renderRichText(node.children || [])}</h5>;
            case 'h6':
                return <h6 key={index} className="text-base font-semibold mb-2 mt-2">{renderRichText(node.children || [])}</h6>;
            case 'p':
                return <p key={index} className="text-base mb-4">{renderRichText(node.children || [])}</p>;
            case 'ul':
                return <ul key={index} className="list-disc list-inside mb-4 pl-4">{renderRichText(node.children || [])}</ul>;
            case 'ol':
                return <ol key={index} className="list-decimal list-inside mb-4 pl-4">{renderRichText(node.children || [])}</ol>;
            case 'li':
                return <li key={index} className="mb-1">{renderRichText(node.children || [])}</li>;
            case 'blockquote':
                return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 italic my-4">{renderRichText(node.children || [])}</blockquote>;
            case 'code':
                return <code key={index} className="bg-gray-100 text-gray-800 rounded px-1 py-0.5 font-mono">{renderRichText(node.children || [])}</code>;
            case 'pre':
                return <pre key={index} className="bg-gray-100 text-gray-800 rounded p-4 overflow-x-auto mb-4 font-mono">{renderRichText(node.children || [])}</pre>;
            case 'strong':
                return <strong key={index} className="font-bold">{renderRichText(node.children || [])}</strong>;
            case 'em':
                return <em key={index} className="italic">{renderRichText(node.children || [])}</em>;
            case 'u':
                return <u key={index} className="underline">{renderRichText(node.children || [])}</u>;
            case 'strike':
                return <s key={index} className="line-through">{renderRichText(node.children || [])}</s>;
            case 'hr':
                return <hr key={index} className="my-8 border-t border-gray-300" />;
            case 'link':
                return (
                    <Link
                        key={index}
                        href={node.url || '#'}
                        target={node.newTab ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 underline transition-colors duration-200"
                    >
                        {renderRichText(node.children || [])}
                    </Link>
                );
            case 'image':
                return (
                    <div key={index} className="my-4">
                        <Image
                            src={node.url || ''}
                            alt={node.text || 'Image'}
                            width={600}
                            height={400}
                            layout="responsive"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                );
            default:
                return node.text ? (
                    <span key={index} className="inline-block">
                        {node.text.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </span>
                ) : null;
        }
    });
};

export default renderRichText;