export type SystemDesignSection = {
    id: 'fundamentals' | 'platforms' | 'piyush-garg';
    title: string;
    description: string;
};

export const systemDesignSections: SystemDesignSection[] = [
    {
        id: 'fundamentals',
        title: 'Fundamentals & Concepts',
        description:
            'The building blocks every distributed system stands on — scaling, caching, storage and the trade-offs between them.'
    },
    {
        id: 'platforms',
        title: 'Design of Platforms',
        description: 'End-to-end breakdowns of real systems, from URL shorteners to chat at scale.'
    },
    {
        id: 'piyush-garg',
        title: 'System Design by Piyush Garg',
        description: 'Roadmaps and resources for learning system design the practical way.'
    }
];
