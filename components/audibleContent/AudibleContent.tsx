import React from 'react'

export default function AudibleContent({ ...elProps }: {} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps} style={{ ...elProps?.style }}>AudibleContent</div>

    )
}
