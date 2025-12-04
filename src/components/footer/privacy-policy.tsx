import Paragraph from "../ui/typography/paragraph";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-4">
      <Paragraph size="medium">
        <strong>1. Introduction</strong>
      </Paragraph>
      <Paragraph size="medium">
        Intergalactic, Limited (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
        your privacy. This Privacy Policy explains how we handle information
        when you visit our website.
      </Paragraph>

      <Paragraph size="medium">
        <strong>2. Information We Collect</strong>
      </Paragraph>
      <Paragraph size="medium">
        We do not actively track or collect personal information from visitors
        to our website. However, like most web servers, our server automatically
        logs certain non-personal information, including:
      </Paragraph>
      <ul className="list-disc list-inside ml-4 space-y-2 text-purple font-geist font-normal text-base leading-tight">
        <li>IP addresses</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Pages visited and time spent on pages</li>
        <li>Referring website addresses</li>
      </ul>
      <Paragraph size="medium">
        This information is standard server log data that is automatically
        collected by web servers and is not used to identify individual users.
      </Paragraph>

      <Paragraph size="medium">
        <strong>3. How We Use Information</strong>
      </Paragraph>
      <Paragraph size="medium">
        The automatically logged information is used solely for:
      </Paragraph>
      <ul className="list-disc list-inside ml-4 space-y-2 text-purple font-geist font-normal text-base leading-tight">
        <li>Ensuring the security and proper functioning of our website</li>
        <li>Diagnosing technical issues and improving website performance</li>
        <li>Analyzing general usage patterns (in aggregate, not individual)</li>
      </ul>

      <Paragraph size="medium">
        <strong>4. No Tracking or Cookies</strong>
      </Paragraph>
      <Paragraph size="medium">
        We do not use tracking cookies, analytics services, or any other
        tracking technologies to monitor your browsing behavior. We do not
        collect, store, or share personal information with third parties.
      </Paragraph>

      <Paragraph size="medium">
        <strong>5. Third-Party Services</strong>
      </Paragraph>
      <Paragraph size="medium">
        Our website may contain links to third-party websites or services. We
        are not responsible for the privacy practices of these external sites.
        We encourage you to review the privacy policies of any third-party sites
        you visit.
      </Paragraph>

      <Paragraph size="medium">
        <strong>6. Data Security</strong>
      </Paragraph>
      <Paragraph size="medium">
        While we implement reasonable security measures to protect the
        automatically logged server information, no method of transmission over
        the Internet or electronic storage is 100% secure. We cannot guarantee
        absolute security of any information.
      </Paragraph>

      <Paragraph size="medium">
        <strong>7. Children&apos;s Privacy</strong>
      </Paragraph>
      <Paragraph size="medium">
        Our website is not directed to individuals under the age of 18. We do
        not knowingly collect personal information from children.
      </Paragraph>

      <Paragraph size="medium">
        <strong>8. Changes to This Privacy Policy</strong>
      </Paragraph>
      <Paragraph size="medium">
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
      </Paragraph>

      <Paragraph size="medium">
        <strong>9. Open Source</strong>
      </Paragraph>
      <Paragraph size="medium">
        This website and its underlying software are provided as open source
        software. The source code is publicly available, and you may review how
        the website operates.
      </Paragraph>

      <Paragraph size="medium">
        <strong>10. Contact</strong>
      </Paragraph>
      <Paragraph size="medium">
        If you have any questions about this Privacy Policy, please contact us
        through the official channels provided on this website.
      </Paragraph>
    </div>
  );
}
