interface Props {
    blobsEnabled: boolean;
    grainEnabled: boolean;
}

/**
 * Fixed ambient blobs + grain overlay behind all content.
 * Purely decorative — hidden from assistive tech.
 */
export default function AmbientBackground({ blobsEnabled, grainEnabled }: Props) {
    return (
        <>
            {blobsEnabled && (
                <div className="bg" aria-hidden="true">
                    <div className="blob blob-1" />
                    <div className="blob blob-2" />
                    <div className="blob blob-3" />
                    <div className="blob blob-4" />
                </div>
            )}
            {grainEnabled && <div className="grain" aria-hidden="true" />}
        </>
    );
}
