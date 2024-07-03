import { User } from '@/payload-types'
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    render,
} from '@react-email/components'

import * as React from "react"

interface VerifyEmailProps {
    actionLabel: string
    buttonText: string
    href: string,
    user: User
}

export const VerifyEmail = ({
    actionLabel,
    buttonText,
    href,
    user
}: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>
                The marketplace for high-quality cheats.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src={`https://cdn.skailar.com/v1/assets/img/logo.png`}
                        width='170'
                        height='170'
                        alt='Skailar'
                        style={logo}
                    />
                    <Text style={paragraph}>Hi {user.username},</Text>
                    <Text style={paragraph}>
                        Welcome to Skailar, the marketplace for
                        high quality cheats. Use the button below
                        to {actionLabel}.
                    </Text>
                    <Section style={btnContainer}>
                        <Button style={button} href={href}>
                            {buttonText}
                        </Button>
                    </Section>
                    <Text style={paragraph}>
                        Best,
                        <br />
                        The Skailar team
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        If you did not request this email, you can
                        safely ignore it.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export const VerifyEmailHtml = (
    props: VerifyEmailProps
) => render(<VerifyEmail {...props} />, { pretty: true })

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
}

const logo = {
    margin: '0 auto',
}

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
}

const btnContainer = {
    textAlign: 'center' as const,
}

const button = {
    padding: '12px 12px',
    backgroundColor: '#2563eb',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
}

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
}

const footer = {
    color: '#8898aa',
    fontSize: '12px',
}
