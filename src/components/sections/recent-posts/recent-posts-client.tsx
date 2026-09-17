"use client";

import AnimateOnView from "@/animation/motion-section";
import { fadeUp, revealStagger, staggerChildren } from "@/animation/variants";
import ScrollAnchor from "@/components/scroll-anchor";
import Heading from "@/components/ui/typography/heading";
import Paragraph from "@/components/ui/typography/paragraph";
import SectionLabel from "@/components/ui/labels/section";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Post } from "./section";

export default function RecentPostsClient({ posts }: { posts: Post[] }) {
  const postsRef = useRef<HTMLDivElement>(null);
  const [activePostIndex, setActivePostIndex] = useState(0);

  useEffect(() => {
    const container = postsRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 767px)");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (!isMobile.matches || prefersReducedMotion.matches) return;

    let activeIndex = 0;
    const intervalId = window.setInterval(() => {
      const cards = Array.from(container.children) as HTMLElement[];
      if (cards.length === 0) return;

      activeIndex = (activeIndex + 1) % cards.length;
      setActivePostIndex(activeIndex);
      container.scrollTo({
        left: cards[activeIndex].offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const container = postsRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(container.children) as HTMLElement[];
      if (cards.length === 0) return;

      const nextIndex = cards.reduce((closestIndex, card, index) => {
        const currentDistance = Math.abs(container.scrollLeft - card.offsetLeft);
        const closestDistance = Math.abs(
          container.scrollLeft - cards[closestIndex].offsetLeft
        );

        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);

      setActivePostIndex(nextIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimateOnView
      className="bg-beige px-6 py-16 md:px-[50px] xl:px-0 lg:py-20"
      variants={revealStagger(0.1, 18)}
    >
      <section className="container relative mx-auto max-xl:!px-0">
        <ScrollAnchor id="blog" />
        <motion.div className="max-w-2xl lg:max-w-none" variants={fadeUp(14)}>
          <SectionLabel>From the blog</SectionLabel>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <Heading size="large" className="min-w-0 text-purple">
              Recent notes
            </Heading>
            <motion.div variants={fadeUp(10)}>
              <Link
                href="https://hydration.substack.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-pink px-5 py-3 text-sm lg:text-base text-white transition hover:bg-purple"
              >
                Visit Substack
              </Link>
            </motion.div>
          </div>
          <Paragraph size="large" className="mt-4 max-w-xl text-purple-dim">
            Short reads on security, strategy, and product updates from the
            Hydration team.
          </Paragraph>
        </motion.div>

        <motion.div
          ref={postsRef}
          className="-mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pl-6 pr-6 pb-4 [scrollbar-width:none] [scroll-padding-left:1.5rem] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 md:[scroll-padding-left:0] [&::-webkit-scrollbar]:hidden"
          variants={staggerChildren(0.12)}
        >
          {posts.map((post) => (
            <PostCard key={post.href} post={post} />
          ))}
        </motion.div>

        <div className="mt-1 flex justify-center gap-1.5 md:hidden">
          {posts.map((post, index) => (
            <span
              key={post.href}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activePostIndex === index ? "w-6 bg-pink" : "w-1.5 bg-purple/20"
              }`}
            />
          ))}
        </div>
      </section>
    </AnimateOnView>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      className="flex h-full w-[82vw] max-w-[22rem] shrink-0 snap-start first:ml-0 md:w-auto md:max-w-none"
      variants={fadeUp(24)}
    >
      <Link
        href={post.href}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex h-full w-full flex-col overflow-hidden rounded-[2rem] bg-white transition duration-300"
      >
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-[1.35rem] bg-purple">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple/45 via-transparent to-transparent" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 px-0.5 pb-0.5 pt-6 max-lg:min-h-44 lg:min-h-0 lg:pt-7">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-purple/60">
              <span>{post.date}</span>
              <span className="h-px flex-1 bg-purple/10" />
            </div>
            <h3 className="font-gazpacho text-[1.275rem] font-medium leading-[1.2] text-purple transition group-hover:text-pink lg:text-[1.36rem]">
              {post.title}
            </h3>
            <p className="text-sm leading-6 text-purple-dim">{post.preview}</p>
            <motion.div
              className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-pink transition group-hover:translate-x-0.5"
              variants={fadeUp(10)}
            >
              Read on Substack
              <span aria-hidden="true">→</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
