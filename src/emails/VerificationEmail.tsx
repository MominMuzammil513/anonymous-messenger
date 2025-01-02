import * as React from 'react';
import { Html, Head, Preview, Heading, Section, Row, Text } from "@react-email/components";

export default function VerificationEmail({ username, otp }: { username: string, otp: string }) {
  return (
    <Html lang="en">
      <Head>
        <title>Your verification OTP</title>
      </Head>
      <Preview>Your verification OTP</Preview>
      <Heading>Your OTP is: {otp}</Heading>
      <Section>
        <Row>
          <Heading>{username}</Heading>
        </Row>
        <Row>
          <Text>Thank you for registering. Please use the following verification code to complete your registration:</Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
      </Section>
    </Html>
  );
}
