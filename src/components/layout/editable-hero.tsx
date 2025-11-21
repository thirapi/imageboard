"use client"

import { useState } from "react"
import { Compass, Zap, MessageSquare } from "lucide-react"

interface EditableHeroProps {
    badge: string
    heading: string
    description: string
    boards: any[]
    popularThreads: any[]
}

export function EditableHero({ badge, heading, description, boards, popularThreads }: EditableHeroProps) {
    const [isEditingBadge, setIsEditingBadge] = useState(false)
    const [isEditingHeading, setIsEditingHeading] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)

    const [editedBadge, setEditedBadge] = useState(badge)
    const [editedHeading, setEditedHeading] = useState(heading)
    const [editedDescription, setEditedDescription] = useState(description)

    return (
        <div className="relative py-20">
            {/* Layered geometric background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-40 blur-3xl" />
                <div className="absolute -bottom-32 left-0 w-72 h-72 rounded-full bg-gradient-to-tr from-accent/3 to-transparent opacity-30 blur-3xl" />
                <div className="absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-gradient-to-tl from-primary/3 to-transparent opacity-20 blur-3xl" />
            </div>

            {/* Geometric decorative elements */}
            <div className="absolute top-0 left-8 w-28 h-28 border-2 border-primary/15 rotate-45 opacity-40" />
            {/* <div className="absolute bottom-8 right-12 w-20 h-20 border-2 border-primary/15 opacity-30" /> */}
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-accent/20 rounded-lg" />
            <div className="hidden md:absolute top-1/2 right-20 w-24 h-24 border-2 border-primary/20 opacity-30" />
            <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-primary/15 rotate-45 opacity-40" />



            <div className="relative z-10 text-center space-y-6">
                {/* Editable Badge */}
                <div
                    onClick={() => setIsEditingBadge(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/8 to-accent/8 border border-primary/30 rounded-full backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
                >
                    <Compass className="w-4 h-4 text-primary" />
                    {isEditingBadge ? (
                        <input
                            autoFocus
                            value={editedBadge}
                            onChange={(e) => setEditedBadge(e.target.value)}
                            onBlur={() => setIsEditingBadge(false)}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditingBadge(false)}
                            className="text-sm font-medium text-primary uppercase tracking-widest bg-transparent outline-none border-b border-primary/50 px-1 w-auto min-w-[150px]"
                        />
                    ) : (
                        <span className="text-sm font-medium text-primary uppercase tracking-widest group-hover:text-primary/80">
                            {editedBadge}
                        </span>
                    )}
                </div>

                {/* Editable Heading */}
                <div onClick={() => setIsEditingHeading(true)} className="cursor-pointer group">
                    {isEditingHeading ? (
                        <input
                            autoFocus
                            value={editedHeading}
                            onChange={(e) => setEditedHeading(e.target.value)}
                            onBlur={() => setIsEditingHeading(false)}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditingHeading(false)}
                            className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight bg-transparent outline-none border-b-2 border-primary/50 px-2 py-1 w-full"
                        />
                    ) : (
                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight group-hover:text-primary/80 transition-colors">
                            {editedHeading.split(" ").map((word, i) => (
                                <span key={i} className="inline-block mr-1">
                                    {word}
                                </span>
                            ))}
                        </h1>
                    )}
                </div>



                {/* Editable Description */}
                <div onClick={() => setIsEditingDescription(true)} className="cursor-pointer group">
                    {isEditingDescription ? (
                        <textarea
                            autoFocus
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            onBlur={() => setIsEditingDescription(false)}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light bg-transparent outline-none border border-primary/50 rounded p-3 w-full resize-none"
                            rows={4}
                        />
                    ) : (
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light group-hover:text-muted-foreground/80 transition-colors">
                            {editedDescription}
                        </p>
                    )}
                </div>

                {/* Stats section */}
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <div className="flex items-center gap-2 px-4 py-2 
                  bg-primary/30 dark:bg-primary/20 
                  border border-primary/60 dark:border-primary/40 
                  rounded-lg">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs sm:text-sm font-medium">{boards.length} Active Boards</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 
                  bg-primary/30 dark:bg-primary/20 
                  border border-primary/60 dark:border-primary/40 
                  rounded-lg">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-xs sm:text-sm font-medium">{popularThreads.length} Trending</span>
                    </div>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 pt-12">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <div className="relative">
                        <div className="w-3 h-3 bg-primary/60 rounded-full" />
                        <div className="absolute inset-0 w-3 h-3 bg-primary/30 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                </div>
            </div>
        </div>
    )
}
