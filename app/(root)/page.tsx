import { Container, FiltersDrawer, SearchInput, Title } from "@/shared/components/shared";
import { TopBar } from "@/shared/components/shared/top-bar";
import { Filters } from "@/shared/components/shared/filters";
import { ProductsGroupList } from "@/shared/components/shared/products-group-list";
import { Suspense } from "react";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizzas";



export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {

  const categories = await findPizzas(searchParams);


  return (
    <>

      <Container className="mt-5 mb-5 md:mt-10 md:mb-10">
        <div className="flex items-center justify-left pl-4 md:pl-0 gap-4">
          <Title text="Меню" size="lg" className="font-extrabold pl-4" />
          <div className="md:hidden w-[80%]">
            <SearchInput />
          </div>
        </div>
      </Container>


      <TopBar categories={categories.filter((category) => category.products.length > 0)} />


      <Container className="mt-10 pb-14">
        <div className="flex-row md:flex gap-[40px] sm:gap-[80px] px-4 lg:px-0">
          {/*filter*/}
          <div className="hidden w-[250px] md:block md:pl-4">
            <Suspense>
              <Filters />
            </Suspense>
          </div>

          <div className="block pl-4 md:hidden lg:hidden w-[15%]]">
            <FiltersDrawer />
          </div>

          {/*product list*/}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map((category) => (
                category.products.length > 0 && (
                  <ProductsGroupList
                    key={category.id}
                    title={category.name}
                    categoryId={category.id}
                    items={category.products}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
