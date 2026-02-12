import type { Metadata } from "next";
import { ZODIAC_ANIMALS } from "@/types/zodiac";
import ZodiacPageClient from "./client";

type PageProps = {
  params: Promise<{ animal: string }>;
};

export async function generateStaticParams() {
  return ZODIAC_ANIMALS.map((z) => ({ animal: z.key }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { animal } = await params;
  const zodiac = ZODIAC_ANIMALS.find((z) => z.key === animal);

  if (!zodiac) {
    return { title: "띠별 운세를 찾을 수 없습니다" };
  }

  const yearStr = zodiac.years.slice(-3).join(', ');

  return {
    title: `${zodiac.label} 오늘의 운세 - ${zodiac.emoji} 띠별 포춘쿠키`,
    description: `${zodiac.label}(${yearStr}년생) 오늘의 운세를 포춘쿠키로 확인하세요! 매일 새로운 ${zodiac.label} 운세를 무료로 제공합니다.`,
    keywords: [`${zodiac.label}`, `${zodiac.label} 운세`, '띠별운세', '오늘의 운세', '포춘쿠키'],
    openGraph: {
      title: `${zodiac.emoji} ${zodiac.label} 오늘의 운세 - 포춘쿠키`,
      description: `${zodiac.label} 오늘의 운세를 확인하세요! 포춘쿠키를 깨고 나의 띠별 운세를 알아보세요.`,
    },
  };
}

export default async function ZodiacPage({ params }: PageProps) {
  const { animal } = await params;
  return <ZodiacPageClient animal={animal} />;
}
