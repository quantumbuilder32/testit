import React from 'react'
export default function EBookContent({ ...elProps }: {} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps} style={{ ...elProps?.style }}>EBookContent</div>

    )
}
