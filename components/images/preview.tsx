// preview.tsx  — replace file contents with this
'use client'

import React, { useMemo, useEffect, useCallback } from 'react'
import { Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "../ui/button"

type Props = {
    images: (string | File)[]
    update: (images: (string | File)[]) => void
}

export const Preview = ({ images, update }: Props) => {
    // compute URLs: for File => createObjectURL, for string => use as-is
    const objectURLs = useMemo(() => {
        return images.map(img => (img instanceof File ? URL.createObjectURL(img) : img));
    }, [images]);

    // revoke blob URLs when objectURLs changes or component unmounts
    useEffect(() => {
        return () => {
            objectURLs.forEach(url => {
                if (typeof url === 'string' && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [objectURLs]);

    const removeFile = useCallback((index: number) => {
        // let the parent be the single source of truth
        update(images.filter((_, i) => i !== index));
    }, [images, update]);

    return (
        <div className="grid sm:grid-cols-2 w-full gap-4">
            {objectURLs.map((image, index) =>
                <div key={index} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                        <Image
                            src={image}
                            alt={`Package Image ${index}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFile(index)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}



// 'use client'

// import React, { useEffect } from 'react'
// import { Trash2 } from "lucide-react"
// import Image from "next/image"

// import { Button } from "../ui/button"

// type Props = {
//     images: (string | File)[]
//     update: (images: (string | File)[]) => void
// }

// export const Preview = ({ images, update }: Props) => {
//     const [existingImages, setExistingImages] = React.useState<(string | File)[]>(images);

//     const objectURLs = React.useMemo(() => {
//         return existingImages.map(img => img instanceof File ? URL.createObjectURL(img) : img)
//     }, [images])

//     // Cleanup blob URLs on unmount or when images change
//     React.useEffect(() => {
//         return () => {
//             objectURLs.forEach(url => {
//                 if (url.startsWith('blob:')) URL.revokeObjectURL(url)
//             })
//         }
//     }, [objectURLs])

//     const removeFile = React.useCallback(
//         (index: number) => {
//             console.log(images.filter((_, i) => i !== index));
//             setExistingImages(images.filter((_, i) => i !== index));
//             update(images.filter((_, i) => i !== index));
//         },
//         [images, update]
//     );

//     return (
//         <div className="grid sm:grid-cols-2 w-full gap-4">
//             {objectURLs.map((image, index) =>
//                 <div key={index} className="relative group">
//                     <div className="aspect-square relative overflow-hidden rounded-lg border">
//                         <Image
//                             src={image}
//                             alt={`Package Image ${index}`}
//                             fill
//                             className="object-cover transition-transform group-hover:scale-105"
//                         />
//                     </div>
//                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
//                         <Button
//                             type="button"
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => removeFile(index)}
//                         >
//                             <Trash2 className="h-3 w-3" />
//                         </Button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
