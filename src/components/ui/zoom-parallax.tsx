'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceItem {
	src?: string;
	title: string;
	description: string;
	icon?: LucideIcon;
	alt?: string;
	path?: string;
}

interface ZoomParallaxProps {
	/** Array of services to be displayed in the parallax effect max 7 items */
	items: ServiceItem[];
	lang?: string;
	categories?: {
		audio: string;
		creative: string;
		data: string;
	};
}

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function ZoomParallax({ items, lang = 'es', categories }: ZoomParallaxProps) {
	const container = useRef(null);
	const navigate = useNavigate();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	// Fallback Mobile Parallax (Simple Vertical Grid)
	if (isMobile) {
		return (
			<div className="w-full px-6 py-12 flex flex-col gap-6">
				{items.map(({ src, title, description, icon: Icon, alt, path }, index) => (
					<button 
						key={index}
						onClick={() => path && navigate(path)}
						className="relative h-[25vh] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-lg flex flex-col items-center justify-center p-6 group transition-all duration-700 text-center outline-none metallic-vinotinto-card ring-1 ring-white/5 focus:ring-2 focus:ring-sasori-red/30"
					>
						{src && (
							<div className="absolute inset-0 z-0">
								<img loading="lazy" 
									src={src} 
									alt={title}
									className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700 scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-sasori-wine/70 to-transparent" />
							</div>
						)}
						{Icon && (
							<div className="relative z-10 mb-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-inner border border-white/10 group-hover:shadow-[0_0_20px_rgba(226,6,19,0.5)] transition-all duration-500">
								<Icon className="text-white w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
							</div>
						)}
						<div className="relative z-10 flex flex-col items-center px-2">
							<h3 className="text-sm font-black text-white uppercase tracking-[0.1em] leading-tight group-hover:text-sasori-red transition-colors text-center">
								{title}
							</h3>
						</div>
					</button>
				))}
			</div>
		);
	}

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{items.map(({ src, title, description, icon: Icon, alt, path }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>*]:!-top-[30vh] [&>*]:!left-[5vw] [&>*]:!h-[32vh] [&>*]:!w-[32vw]' : ''} ${index === 2 ? '[&>*]:!-top-[10vh] [&>*]:!-left-[25vw] [&>*]:!h-[40vh] [&>*]:!w-[28vw]' : ''} ${index === 3 ? '[&>*]:!left-[27.5vw] [&>*]:!h-[28vh] [&>*]:!w-[30vw]' : ''} ${index === 4 ? '[&>*]:!top-[27.5vh] [&>*]:!left-[5vw] [&>*]:!h-[30vh] [&>*]:!w-[25vw]' : ''} ${index === 5 ? '[&>*]:!top-[27.5vh] [&>*]:!-left-[22.5vw] [&>*]:!h-[28vh] [&>*]:!w-[35vw]' : ''} ${index === 6 ? '[&>*]:!top-[22.5vh] [&>*]:!left-[25vw] [&>*]:!h-[22vh] [&>*]:!w-[22vw]' : ''} `}
						>
							<button 
								onClick={() => path && navigate(path)}
								className="relative h-[25vh] w-[25vw] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[8px_8px_24px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-8 group transition-all duration-700 text-center outline-none focus:ring-2 focus:ring-sasori-red/30 metallic-vinotinto-card"
							>
								{/* Background Image Overlay */}
								{src && (
									<div className="absolute inset-0 z-0">
										<img loading="lazy" 
											src={src} 
											alt={title}
											className="w-full h-full object-cover opacity-15 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700 scale-110 group-hover:scale-100"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-sasori-wine/60 to-transparent" />
									</div>
								)}

								{/* Top-left subtle highlight for claymorphism */}
								<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-1" />
								
								{/* Icon Section - Centered */}
								{Icon && (
									<div className="relative z-10 mb-3 md:mb-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm shadow-[inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] border border-white/10 group-hover:shadow-[0_0_30px_rgba(226,6,19,0.3)] transition-all duration-500">
										<Icon className="text-white w-6 h-6 md:w-[3.5vw] md:h-[3.5vw] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-500" />
									</div>
								)}

								{/* Title Section - Centered below icon */}
								<div className="relative z-10 flex flex-col items-center px-4">
									<h3 className="text-[10px] sm:text-xs md:text-[1.3vw] font-black text-white uppercase tracking-tighter leading-tight group-hover:text-sasori-red transition-colors text-center">
										{title}
									</h3>
									{/* Subtle indicator dot */}
									<div className="mt-2 md:mt-3 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-sasori-red shadow-[0_0_8px_rgba(226,6,19,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>

								{/* White/Silver Glow on hover */}
								<div className="absolute inset-x-0 bottom-0 h-1 bg-white/0 group-hover:bg-white/20 blur-sm transition-all" />
							</button>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}

