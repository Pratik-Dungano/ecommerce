import React from 'react'

import PageHeader from "./PageHeader"

export default function Container({ heading, children, type="section" }) {
	return (
		<section className="my-4 container mx-auto">
			<PageHeader h2={type !== "page"}>
				{heading}
			</PageHeader>
			<hr className="h-px w-1/2 mx-auto bg-gray-300 mt-2 mb-8" />
			{children}
		</section>
	)
}