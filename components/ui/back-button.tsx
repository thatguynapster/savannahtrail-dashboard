import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "./button"

type Props = {
    link: string
}

const BackButton = ({ link }: Props) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={link}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                {/* <div>
                    <h1 className="text-3xl font-bold">Update Package Details</h1>
                </div> */}
            </div>
        </div>
    )
}

export default BackButton