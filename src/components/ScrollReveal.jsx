import React from 'react';
import { motion } from 'framer-motion';

const defaultVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ScrollReveal = ({
    children,
    variants = defaultVariants,
    delay = 0,
    className = "",
    once = true,
    amount = 0.3,
    as = "div",
    ...props
}) => {
    const Component = motion[as] || motion.div;
    return (
        <Component
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={variants}
            transition={{ delay }}
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
};

export const FadeInRight = ({ children, delay = 0, className = "" }) => (
    <ScrollReveal
        variants={{
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
        }}
        delay={delay}
        className={className}
    >
        {children}
    </ScrollReveal>
);

export const ZoomIn = ({ children, delay = 0, className = "" }) => (
    <ScrollReveal
        variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
        }}
        delay={delay}
        className={className}
    >
        {children}
    </ScrollReveal>
);

export default ScrollReveal;
