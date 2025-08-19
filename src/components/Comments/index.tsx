import { useState } from 'react';
import { ProductDetail, TranslationsKeys } from '../../setting/Types';

const CommentsSection = ({
    data,
    translate,
}: {
    data: ProductDetail;
    translate: TranslationsKeys;
}) => {
    const [comments, setComments] = useState(data.comments);
    const [sortOrder, setSortOrder] = useState('newest');
    const [ShovingCommentsCount, setShovingCommentsCount] = useState<number>(5);

    const handleSortChange = (event: any) => {
        const order = event.target.value;
        setSortOrder(order);

        const sortedComments = [...comments].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (order === 'newest') {
                return dateB.getTime() - dateA.getTime();
            } else {
                return dateA.getTime() - dateB.getTime();
            }
        });
        setComments(sortedComments);
    };
    // useEffect(() => {
    //     setComments(data?.comments);
    // }, [data]);

    return (
        <>
            <section className="flex flex-col w-full max-md:max-w-full mt-10 ">
                <header className="flex max-sm:flex-row  gap-10 justify-between items-center w-full max-md:max-w-full">
                    <p className="gap-3 self-stretch my-auto text-sm text-black">
                        {data?.comments.length} {translate?.rey}
                    </p>
                    <div className="flex gap-2 max-sm:justify-start max-sm:w-fit items-center self-stretch my-auto max-sm:min-w-0 min-w-[240px] flex-wrap">
                        <label
                            htmlFor="sortDropdown"
                            className="self-stretch my-auto text-sm text-black text-opacity-60"
                        >
                            {translate?.sort}
                        </label>
                        <div className="flex overflow-hidden gap-10 max-sm:min-w-[100px] max-sm:w-[190px] p-3 my-auto text-base bg-white rounded-[100px]  min-w-[240px] text-black text-opacity-90 w-[283px]">
                            <select
                                id="sortDropdown"
                                className="flex-grow bg-transparent border-none "
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="newest">
                                    {translate?.Yenidən_köhnəyə}
                                </option>
                                <option value="oldest">
                                    {translate?.Köhnədən_yeniyə}
                                </option>
                            </select>
                        </div>
                    </div>
                </header>
                <main className="flex flex-col mt-7 w-full max-md:max-w-full pb-[20px]">
                    {comments?.map((review, i) => {
                        if (i <= ShovingCommentsCount) {
                            return (
                                <article
                                    key={review.id}
                                    className="flex overflow-hidden flex-col justify-center p-7 mt-3 max-w-full bg-white rounded-3xl w-full max-md:px-5"
                                >
                                    <div className="flex flex-col w-full max-md:max-w-full">
                                        <header className="flex gap-3 items-center self-start text-sm text-black">
                                            <img
                                                loading="lazy"
                                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5540671aa70313d23346b763636f4f483f2787cbfffaa12eefa61b058a9f85d?placeholderIfAbsent=true&apiKey=c6f3c7bb740649e5a32c147b3037a1c2"
                                                alt={` avatar`}
                                                className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[100px] w-[60px]"
                                            />
                                            <div className="flex flex-col justify-center self-stretch my-auto w-[120px]">
                                                <div className="flex flex-row gap-1">
                                                    {Array.from({
                                                        length: review.star,
                                                    }).map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            width="20"
                                                            height="19"
                                                            viewBox="0 0 20 19"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M9.04894 1.42705C9.3483 0.505741 10.6517 0.50574 10.9511 1.42705L12.4697 6.10081C12.6035 6.51284 12.9875 6.7918 13.4207 6.7918H18.335C19.3037 6.7918 19.7065 8.03141 18.9228 8.60081L14.947 11.4894C14.5966 11.744 14.4499 12.1954 14.5838 12.6074L16.1024 17.2812C16.4017 18.2025 15.3472 18.9686 14.5635 18.3992L10.5878 15.5106C10.2373 15.256 9.7627 15.256 9.41221 15.5106L5.43648 18.3992C4.65276 18.9686 3.59828 18.2025 3.89763 17.2812L5.41623 12.6074C5.55011 12.1954 5.40345 11.744 5.05296 11.4894L1.07722 8.60081C0.293507 8.03141 0.696283 6.7918 1.66501 6.7918H6.57929C7.01252 6.7918 7.39647 6.51284 7.53035 6.10081L9.04894 1.42705Z"
                                                                fill="#FABD21"
                                                            />
                                                        </svg>
                                                    ))}
                                                </div>
                                                {/* <img
                                            loading="lazy"
                                            src={review.ratingSrc}
                                            alt="User rating"
                                            className="object-contain max-w-full aspect-[5] w-[120px]"
                                        /> */}
                                                <p className="self-start mt-1">
                                                    {review.customer?.customer
                                                        ? review.customer
                                                              .customer
                                                        : ''}
                                                </p>
                                            </div>
                                        </header>
                                        <div className="flex flex-col mt-5 w-full max-md:max-w-full">
                                            <time className="text-sm text-black text-opacity-60 max-md:max-w-full">
                                                {review.date}
                                            </time>
                                            <p className="mt-2 text-base text-black text-opacity-80 max-md:max-w-full">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        }
                    })}
                    {/* {sortedReviews.map((review) => (
                    <article
                        key={review.id}
                        className="flex overflow-hidden flex-col justify-center p-7 mt-3 max-w-full bg-white rounded-3xl w-full max-md:px-5"
                    >
                        <div className="flex flex-col w-full max-md:max-w-full">
                            <header className="flex gap-3 items-center self-start text-sm text-black">
                                <img
                                    loading="lazy"
                                    src={review.avatarSrc}
                                    alt={`${review.name}'s avatar`}
                                    className="object-contain shrink-0 self-stretch my-auto aspect-square rounded-[100px] w-[60px]"
                                />
                                <div className="flex flex-col justify-center self-stretch my-auto w-[120px]">
                                    <img
                                        loading="lazy"
                                        src={review.ratingSrc}
                                        alt="User rating"
                                        className="object-contain max-w-full aspect-[5] w-[120px]"
                                    />
                                    <p className="self-start mt-1">
                                        {review.name}
                                    </p>
                                </div>
                            </header>
                            <div className="flex flex-col mt-5 w-full max-md:max-w-full">
                                <time className="text-sm text-black text-opacity-60 max-md:max-w-full">
                                    {review.date}
                                </time>
                                <p className="mt-2 text-base text-black text-opacity-80 max-md:max-w-full">
                                    {review.content}
                                </p>
                            </div>
                        </div>
                    </article>
                ))} */}
                </main>
            </section>
            {data.comments.length <= ShovingCommentsCount || (
                <div className=" w-full flex justify-center pb-[80px]">
                    <button
                        className="px-[28px] py-[14px] border border-black rounded-[100px] border-opacity-15"
                        onClick={() =>
                            setShovingCommentsCount(ShovingCommentsCount + 5)
                        }
                    >
                        Daha çox
                    </button>
                </div>
            )}
        </>
    );
};

export default CommentsSection;
