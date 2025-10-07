// select.tsx  — replace file contents with this
'use client'

import { useCallback, useRef } from "react";

type Props = {
    multiple?: boolean;
    max?: number;
    count: number;
    onImagesSelect: (files: File[]) => void;
}

export const Select = ({
    multiple = false,
    max = multiple ? 5 : 1,
    count = 0,
    onImagesSelect,
}: Props) => {
    const imageRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []) as File[];
            if (files.length === 0) return;

            // enforce max in JS (input 'max' attribute is not valid for files)
            if (count + files.length > max) {
                alert(`You can only upload up to ${max} images.`);
                e.target.value = '';
                return;
            }

            // send only the new files to parent; parent should append them to its list
            onImagesSelect(files);

            // reset input so user can select same file again if needed
            e.target.value = '';
        },
        [count, max, onImagesSelect]
    );

    return (
        <>
            <input
                type="file"
                ref={imageRef}
                className="hidden"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
            />

            {count < max && (
                <div className="w-full flex items-center justify-center aspect-square">
                    <p
                        className="text-sm text-info text-center cursor-pointer"
                        onClick={() => imageRef.current?.click()}
                    >
                        Select File(s)
                    </p>
                </div>
            )}
        </>
    );
}



// 'use client'

// import { useCallback, useRef, useState } from "react";


// type Props = {
//     multiple?: boolean;
//     max?: number
//     count: number
//     onImagesSelect: (files: File[]) => void;
// }

// export const Select = ({
//     multiple = false,
//     max = multiple ? 5 : 1,
//     count = 0,
//     onImagesSelect,
// }: Props) => {
//     const imageRef = useRef<any>();
//     const [newImages, setNewImages] = useState<File[]>([]);

//     const handleFileChange = useCallback(
//         (e: React.ChangeEvent<HTMLInputElement>) => {
//             const files = Array.from(e.target.files || []);
//             let u_files: File[] = []

//             if (files.length > 0) {
//                 // Multiple mode - append images
//                 console.log(count, newImages.length, files.length)
//                 if ((count + newImages.length + files.length) > max) {
//                     alert(`You can only upload up to ${max} images.`);
//                     e.target.value = '';
//                     return;
//                 }
//             }

//             // Notify parent component
//             setNewImages(prev => [...prev, ...files]);
//             onImagesSelect([...newImages, ...files]);

//             e.target.value = ''; // Reset input
//         },
//         [count, onImagesSelect]
//     );

//     return (
//         <>
//             <input
//                 type="file"
//                 ref={imageRef}
//                 className="hidden"
//                 accept="image/*"
//                 multiple={multiple}
//                 max={max}
//                 onChange={handleFileChange}
//             />



//             {((count + newImages.length) < max) && (
//                 <div className={("w-full flex items-center justify-center aspect-square")}>
//                     <p
//                         className="text-sm text-info text-center cursor-pointer"
//                         onClick={() => imageRef.current.click()}
//                     >
//                         Select File(s)
//                     </p>
//                 </div>
//             )}
//         </>
//     )
// }
