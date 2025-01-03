import Link from "next/link";

interface Props {
    path: string,
    pageNumber: number,
    isNext: boolean
}

const Pagination = ({ path, pageNumber, isNext }: Props) => {

    return (
        <div className="pagination">
            {/* Previous Page Button */}
            {pageNumber > 1 && (
                <Link href={`/${path}?page=${pageNumber - 1}`} className="pagination-btn text-white">
                    {pageNumber - 1}
                </Link>
            )}

            {/* Current Page Number */}
            <span className="pagination-current">{pageNumber}</span>

            {/* Next Page Button */}
            {isNext && (
                <Link href={`/${path}?page=${pageNumber + 1}`} className="pagination-btn">
                    {pageNumber + 1}
                </Link>
            )}
        </div>
    );
};

export default Pagination;
