import { MaxWidthWrapper } from "@/components/MaxWidthWrapper"
import { ProductReel } from "@/components/product-reel"
import { PRODUCT_CATEGORY } from "@/config"

type Param = string | string[] | undefined

interface ProductsPageProps {
    searchParams: { [key: string]: Param }
}

const parse = (param: Param) => {
    return typeof param === 'string' ? param : undefined
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
    const sort = parse(searchParams.sort)
    const category = parse(searchParams.category)

    const label = PRODUCT_CATEGORY.find(({ value }) => value === category)?.label;

    return (
        <MaxWidthWrapper>
            <ProductReel
                title={label ?? 'Browse high-quality cheats'}
                query={{
                    category,
                    limit: 40,
                    sort: sort === "desc" || sort === 'asc' ? sort : undefined
                }}
            />
        </MaxWidthWrapper>
    )
}

export default ProductsPage