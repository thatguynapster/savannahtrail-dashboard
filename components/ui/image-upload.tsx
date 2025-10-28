'use client';

import clsx from "clsx";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from "./button";

interface ImageFile {
    file: File;
    preview: string;
}

interface ImageUploadProps {
    multiple?: boolean;
    max?: number
    existingImages?: string[];
    onImagesChange?: (images: (string | File)[]) => void;
}

const ImageUpload = ({
    multiple = false,
    max = multiple ? 5 : 1,
    existingImages = [],
    onImagesChange,
}: ImageUploadProps) => {

    const imageRef = useRef<any>();
    // const [existing, setExisting] = useState<string[]>(existingImages);
    // const [newImages, setNewImages] = useState<ImageFile[]>([]);
    const [images, setImages] = useState<(string | ImageFile)[]>(existingImages);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            let u_files: File[] = []

            if (!multiple && files.length > 0) {
                // Single mode - replace all images
                const newImageFiles = files.slice(0, 1).map(file => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                // setNewImages(newImageFiles);
                setImages(prev => [...newImageFiles]);
            } else {
                // Multiple mode - append images
                console.log([...existingImages, ...images, ...files].length)
                if ((images.length + files.length) > max) {
                    alert(`You can only upload up to ${max} images.`);
                    e.target.value = '';
                    return;
                }

                const newImageFiles = files.map(file => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));
                console.log(newImageFiles)
                u_files = [
                    ...images.filter(file => typeof file !== 'string').map(file => file.file),
                    ...newImageFiles.map(file => file.file)
                ]
                // console.log([...newImages, ...newImageFiles])
                // setNewImages(prev => [...prev, ...newImageFiles]);
                console.log([...images, ...newImageFiles])
                setImages(prev => [...prev, ...newImageFiles]);
            }

            // Notify parent component
            if (onImagesChange) {
                // const newFiles = multiple ? [...newImages.map(file => file.file)] : files.slice(0, 1);
                // console.log('new files:', newFiles)
                // console.log('u_files:', u_files)
                // onImagesChange({
                //     existing,
                //     newFiles: u_files
                // });
                console.log(u_files)
                // onImagesChange?.(u_files.map(img => typeof img === 'string' ? img : img.file));
            }

            e.target.value = ''; // Reset input
        },
        [multiple, images, onImagesChange]
    );

    // const removeExisting = useCallback(
    //     (index: number) => {
    //         const updated = existing.filter((_, i) => i !== index);
    //         console.log('removing existing image at index:', index, updated);
    //         setExisting(() => updated);
    //         onImagesChange?.({
    //             existing: updated,
    //             newFiles: newImages.map(img => img.file),
    //         });
    //     },
    //     [existing, newImages, onImagesChange]
    // );

    const removeFile = useCallback(
        (index: number) => {
            // const updated = newImages.filter((_, i) => i !== index);
            // // Revoke object URLs to avoid memory leaks
            // URL.revokeObjectURL(newImages[index].preview);
            // setNewImages(updated);
            // onImagesChange?.({
            //     existing,
            //     newFiles: updated.map(img => img.file),
            // });

            const updated = images.filter((_, i) => i !== index);
            console.log('removing existing image at index:', index, updated);
            setImages(() => updated);
            onImagesChange?.(updated.map(img => typeof img === 'string' ? img : img.file));
        },
        [images, onImagesChange]
    );

    useEffect(() => {
        console.log('images:', images, 'existing:', existingImages)
        // setImages([]);
    }, [existingImages]);

    return (
        <div>
            <input
                type="file"
                ref={imageRef}
                className="hidden"
                accept="image/*"
                multiple={multiple}
                max={max}
                onChange={handleFileChange}
            />

            {/* Preview Section */}
            <div className="grid sm:grid-cols-2 w-full gap-4">
                {/* {existingImages.map((url, index) =>
                    // <div
                    //     key={index}
                    //     className={clsx(
                    //         "relative w-full aspect-square",
                    //         "group",
                    //         "border-2 border-dashed rounded-xl",
                    //         "dark:bg-dark dark:border-light",
                    //         "bg-light border-dark",
                    //     )}
                    // >
                    //     <Image
                    //         src={url}
                    //         className="rounded-xl aspect-square h-32"
                    //         alt={`Existing ${index}`}
                    //         fill
                    //         sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
                    //     />
                    //     <div
                    //         className={clsx(
                    //             "hidden group-hover:block cursor-pointer",
                    //             "absolute right-0 top-0 text-error p-1 rounded-tr-xl rounded-bl-xl"
                    //         )}
                    //         onClick={() => removeExisting(index)}
                    //     >
                    //         <Trash2 className="bg-red-500 text-white w-4 h-4" />
                    //     </div>
                    // </div>
                    <div key={index} className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-lg border">
                            <Image
                                src={url}
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
                )} */}
                {images.map((image, index) =>
                    // <div
                    //     key={index}
                    //     className={clsx(
                    //         "relative w-full aspect-square",
                    //         "group",
                    //         "border-2 border-dashed rounded-xl",
                    //         "dark:bg-dark dark:border-light",
                    //         "bg-light border-dark",
                    //     )}
                    // >
                    //     <Image
                    //         src={image.preview}
                    //         className="rounded-xl"
                    //         alt={`Existing ${index}`}
                    //         fill
                    //         sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
                    //     />
                    //     <div
                    //         className={clsx(
                    //             "hidden group-hover:block cursor-pointer",
                    //             "absolute right-0 top-0 text-error p-1 rounded-tr-xl rounded-bl-xl"
                    //         )}
                    //         onClick={() => removeNew(index)}
                    //     >
                    //         <Trash2 className="bg-red-500 text-white w-4 h-4" />
                    //     </div>
                    // </div>
                    <div key={index} className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-lg border">
                            <Image
                                src={typeof image === 'string' ? image : image.preview}
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

                {(existingImages.length || [...existingImages, ...images].length < max) && (
                    <div className={("w-full flex items-center justify-center aspect-square")}>
                        <p
                            className="text-sm text-info text-center cursor-pointer"
                            onClick={() => imageRef.current.click()}
                        >
                            Select File(s)
                        </p>
                    </div>
                )}
            </div>

        </div>
    )
}


export default ImageUpload