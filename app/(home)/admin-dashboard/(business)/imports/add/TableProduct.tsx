'use client';

import { IProductResponse, getAllProducts } from "@/api/product";
import Icon from "@/components/Icon";
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import { IDetail } from "./page";



export default function TableProduct({
    details,
    onAddDetail,
    onDeleteDetail,
    setDetails
}: {
    details: IDetail[],
    onAddDetail: (newDetail: IDetail) => void,
    onDeleteDetail: (id: number) => void,
    setDetails: (newDetails: IDetail[]) => void,
}) {
    const [products, setProducts] = useState<IProductResponse[]>([]);
    const productsCombobox = products.filter(prod => !details.find(d => d.productId === prod.id));
    const [newDetail, setNewDetail] = useState<IDetail>({
        productId:   0,
        product:  "",
        quantity: 0,
        price: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    function handleAddDetail() {
        const prod = products.find(p => p.id === newDetail.productId);
        onAddDetail({
            ...newDetail,
            product: prod?.name + ""
        });

        const newProductsCombobox = productsCombobox.filter(p => p.id != newDetail.productId);
        const newD = newProductsCombobox?.[0];
        if (newD)
            setNewDetail({
                productId: newD.id,
                product: newD.name,
                price: 0,
                quantity: 0
            })
    }

    const fetchProducts =async () => {
        try {
            const {data} = await getAllProducts();
            setProducts(data);

            if (data?.[0])
                setNewDetail({
                    productId: data?.[0].id,
                    product: data?.[0].name,
                    quantity: 0,
                    price: 0,
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="pt-5 h-full flex flex-col gap-3 border-t">
            <Title icon="box">Items</Title> 
            <section className=" flex flex-col h-full"> 
            <header className="grid grid-cols-8 items-center py-1 px-2 h-11 border-b text-center font-semibold bg-gray-50 rounded-t-md">
                <div className="col-span-3">Product</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-1">Action</div>
            </header>
            <main className="h-[380px] overflow-auto">
            {
                details.map(product => (
                    <div 
                        key={product.productId} 
                        className="grid grid-cols-8 gap-2 items-center text-center  py-1 px-2 h-11 border-b hover:bg-gray-50 cursor-pointer"
                        // onClick={() => onClick(product.id)}
                    >
                        <div className="col-span-3 ">{product.product}</div> 
                        <input 
                            className="col-span-2 h-8 px-3 border rounded-lg" 
                            type="number"
                            value={product.quantity}
                            onChange={e => setDetails(details.map(d => {
                                if (d.productId === product.productId)
                                    return {
                                        ...d,
                                        quantity: Number.parseInt(e.target.value)
                                    }
                                return d;
                            }))}
                            min="0"
                        />
                        <input 
                            className="col-span-2 h-8 px-3 border rounded-lg" 
                            type="number"
                            min="0"
                            value={product.price} 
                            onChange={e => setDetails(details.map(d => {
                                if (d.productId === product.productId)
                                    return {
                                        ...d,
                                        price: Number.parseInt(e.target.value)
                                    }
                                return d;
                            }))}
                        />
                        <div className="col-span-1 flex items-center justify-center">
                            <button 
                                className="grid place-items-center h-9 w-9 bg-red rounded-md text-gray-50 hover:scale-95 transition"
                                onClick={() => onDeleteDetail(product.productId)}
                            >
                                <Icon
                                    name="trash"
                                    size="lg"
                                />
                            </button>
                        </div> 
                    </div>
                ))
            }
            </main>
            {
                productsCombobox.length ?
                <footer className="mt-auto h-14 px-2 grid grid-cols-8 gap-2 items-center bg-gray-100">
                    <select 
                        className="col-span-3 outline-none h-9 px-2 rounded-lg"
                        value={newDetail.productId}
                        onChange={e => setNewDetail({
                            ...newDetail,
                            productId: Number.parseInt(e.target.value)
                        })}
                    >
                    {
                        productsCombobox.map(prod => 
                            <option key={prod.id} value={prod.id}>{prod.name}</option>    
                        )
                    }
                    </select> 
                    <input 
                        className="col-span-2 h-8 px-3 border rounded-lg" 
                        type="number" 
                        min="0"
                        value={newDetail.quantity} 
                        onChange={e => setNewDetail({
                            ...newDetail,
                            quantity: Number.parseInt(e.target.value)
                        })}
                    />
                
                    <input 
                        className="col-span-2 h-8 px-3 border rounded-lg" 
                        type="number"
                        min="0" 
                        value={newDetail.price}
                        onChange={e => setNewDetail({
                            ...newDetail,
                            price: Number.parseInt(e.target.value)
                        })}
                    /> 
                    <div className="col-span-1 flex items-center justify-center">
                        <button 
                            className="grid place-items-center h-9 w-14 bg-emerald-400 rounded-md text-gray-50 hover:scale-95 transition"
                            onClick={handleAddDetail}
                        >
                            <Icon
                                name="plus"
                                size="lg"
                            />
                        </button>
                    </div> 
                </footer> : 
                <></>
            }
        </section>
        </div>
    )
}