/**
 * Renders a JSON-LD <script>. `<` is escaped so string values (e.g. AI-generated
 * blog titles) can never close the script tag early.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
