import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description: "The DPA template available to schools and institutions using Sherpa with student accounts.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "parties",
    heading: "Parties and roles",
    body: (
      <p>
        This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the agreement between the
        institution (&ldquo;Controller&rdquo;) and Sherpa (&ldquo;Processor&rdquo;) when the institution uses
        Sherpa with learner accounts. Where the institution determines why and how learner data is processed,
        it acts as Controller and Sherpa processes that data only on documented instructions.
      </p>
    ),
  },
  {
    id: "scope",
    heading: "Scope and purpose of processing",
    body: (
      <p>
        Processing covers account provisioning (name, email, class), learning telemetry (chapters opened,
        quiz results, mastery scores), and support correspondence. The purpose is delivering the Sherpa study
        service to enrolled learners. Processing continues for the term of the agreement.
      </p>
    ),
  },
  {
    id: "obligations",
    heading: "Processor obligations",
    body: (
      <ul>
        <li>Process personal data only on documented instructions from the Controller.</li>
        <li>Ensure staff authorised to process data are bound by confidentiality.</li>
        <li>Implement the technical and organisational measures described in Annex II.</li>
        <li>Assist the Controller with data subject requests within five working days.</li>
        <li>Notify the Controller without undue delay, and within 72 hours, of a personal data breach.</li>
        <li>Delete or return all personal data at the end of the agreement.</li>
        <li>Make available information necessary to demonstrate compliance, and allow audits.</li>
      </ul>
    ),
  },
  {
    id: "subprocessors",
    heading: "Sub-processors",
    body: (
      <p>
        The Controller grants general authorisation for the sub-processors listed in the{" "}
        <a href="/legal/privacy">Privacy Policy</a>. Sherpa gives 30 days&apos; notice before adding a new
        sub-processor, and the Controller may object on reasonable data-protection grounds.
      </p>
    ),
  },
  {
    id: "transfers",
    heading: "International transfers",
    body: (
      <p>
        Where personal data leaves the EEA or UK, Sherpa relies on Standard Contractual Clauses (2021/914) or
        the UK Addendum, together with supplementary measures such as encryption in transit and at rest.
      </p>
    ),
  },
  {
    id: "children",
    heading: "Children's data",
    body: (
      <p>
        For learners under 13, the Controller is responsible for obtaining verifiable parental consent.
        Sherpa provides a consent-record endpoint and never displays advertising to any learner under 13. See
        the school onboarding guide in SETUP.md.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Liability and term",
    body: (
      <p>
        Liability under this DPA is subject to the limitation of liability in the main{" "}
        <a href="/legal/terms">Terms of Service</a>. The DPA remains in force for as long as Sherpa processes
        personal data on behalf of the Controller.
      </p>
    ),
  },
  {
    id: "signature",
    heading: "How to execute",
    body: (
      <p>
        Email <a href="mailto:schools@sherpa.study">schools@sherpa.study</a> with your institution name and a
        contact. We send a signable copy within two working days, along with the security questionnaire most
        procurement teams ask for.
      </p>
    ),
  },
];

export default function DpaPage() {
  return (
    <>
      <SiteHeader signedIn={false} />
      <main>
        <LegalLayout
          title="Data Processing Agreement"
          summary="For schools and institutions running Sherpa with student accounts. Signable copy on request."
          updated="2 November 2026"
          sections={SECTIONS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
