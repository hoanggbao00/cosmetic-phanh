import { StarIcon } from "@/assets/icons/star-icon";
import { SpecialButton } from "@/components/shared/special-button";
import { cn } from "@/lib/utils";
import { QuoteIcon, Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Kimberly Joe",
    location: "New York",
    rating: 3,
    comment:
      "Finibus ante consectetur eu sapien sem. Suspendisse a massa justo. Cras eget lorem nunc. Fusce nec urna tempus tempus",
    avatar: "/images/feedbacks/avatar-1.png",
  },
  {
    id: 2,
    name: "Stephanie Laura",
    location: "California",
    rating: 2,
    comment:
      "Dictumst nibh sodales vestibulum; pretium pharetra dis proin lacinia. Tortor dis auctor dis dignissim nam torquent quis erat vitae turpis",
    avatar: "/images/feedbacks/avatar-1.png",
  },
  {
    id: 3,
    name: "Kathleen White",
    location: "San Francisco",
    rating: 4,
    comment:
      "Auctor lacus dictumst nisi finibus duis dapibus. Ornare rhoncus ac duis egestas mattis enim eleifend iaculis proin. Nullam urna vitae leo",
    avatar: "/images/feedbacks/avatar-1.png",
  },
];

export default function SectionFeedback() {
  return (
    <div className='w-full px-4 py-16'>
      <div className='mx-auto max-w-7xl'>
        {/* Reviews Header */}
        <div className='mb-16 text-center'>
          <div className='mb-2 flex items-center justify-center gap-2'>
            <StarIcon className='size-4 animate-spin text-primary' />
            <span className='text-sm'>Positive Feedback</span>
          </div>
          <h2 className='font-semibold font-serif text-4xl text-primary md:text-5xl'>
            Customer Service Reviews
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
          {reviews.map((review) => (
            <div key={review.id} className='group relative flex flex-col'>
              {/* Stars */}
              <div className='mb-4 flex'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-yellow-400",
                    )}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className='relative z-10 mb-4 text-muted-foreground'>{review.comment}</p>
              <span className='absolute top-0 right-0 transition-all duration-300 group-hover:top-2'>
                <QuoteIcon className='size-8 fill-accent text-accent' />
              </span>

              {/* Reviewer */}
              <div className='flex items-center gap-4'>
                <div className='size-8 overflow-hidden rounded-full'>
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={48}
                    height={48}
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-1 items-center gap-1'>
                  <div className='h-0.5 flex-1 bg-border/80' />
                  <p className='font-medium text-gray-900 text-sm'>{review.name},</p>
                  <p className='text-gray-500 text-sm'>{review.location}</p>
                  <div className='h-0.5 w-8 bg-border/80' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Promotions */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Promotion 1 */}
          <div className='relative overflow-hidden rounded-lg bg-secondary'>
            <img
              src='/images/promotions/promotion-1.jpg'
              alt='Beauty Products'
              width={400}
              height={300}
              className='absolute inset-0 h-full w-full object-cover'
            />
            <div className='relative z-10 flex flex-col md:flex-row'>
              <div className='p-8 md:w-1/2'>
                <div className='mb-4 flex items-center gap-2'>
                  <StarIcon className='size-4 animate-spin text-primary' />
                  <span className='text-sm'>Fresh Cosmetics</span>
                </div>
                <h3 className='mb-8 font-medium font-serif text-3xl text-gray-900'>
                  Boost Your Beauty Regimen
                </h3>
                <SpecialButton className='w-fit'>Know More</SpecialButton>
              </div>
            </div>
          </div>

          {/* Promotion 2 */}
          <div className='relative overflow-hidden rounded-lg bg-secondary'>
            <img
              src='/images/promotions/promotion-2.jpg'
              alt='Beauty Products'
              width={400}
              height={300}
              className='absolute inset-0 h-full w-full object-cover'
            />
            <div className='relative z-10 flex flex-col md:flex-row'>
              <div className='p-8 md:w-1/2'>
                <div className='mb-4 flex items-center gap-2'>
                  <StarIcon className='size-4 animate-spin text-primary' />
                  <span className='text-sm'>Trending Now</span>
                </div>
                <h3 className='mb-8 font-medium font-serif text-3xl text-gray-900'>
                  Customer-Favorite Products
                </h3>
                <SpecialButton className='w-fit'>Know More</SpecialButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
