'use client';

export default function AddControlSection({

}: {
    
}) {
    return (
        <>
            <select 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                // value={editedDetail.productId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    // const newProdId = Number.parseInt(e.target.value)
                    // const isNaN = Number.isNaN(newProdId);
                    // if (isNaN) return;
                    // setEditedDetail({
                    //     ...editedDetail,
                    //     productId: newProdId, 
                    // });
                }}
            >
            {
                // dropdown.map(prod => 
                //     <option key={prod.value} value={prod.value}>{prod.text}</option>    
                // )
            }
            </select>
            <input 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                type="number"
                min="1"
                max="1000000"
                placeholder="Quantity"
                value={editedDetail.quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditedDetail({
                        ...editedDetail,
                        quantity: Number.parseInt(e.target.value) 
                    })
                }}
            />
            <input 
                className="w-full h-10 pl-2 outline-none border-2 rounded-md"
                type="number"
                min="1"
                placeholder="Price"
                value={editedDetail.price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditedDetail({
                        ...editedDetail,
                        price: Number.parseInt(e.target.value)
                    })
                }}
            />
            <div className='h-10 pl-2 border-2 rounded-md grid place-items-center'>
                {(editedDetail.price * editedDetail.quantity) ? 
                    (editedDetail.price * editedDetail.quantity).toLocaleString() :
                    0
                }
            </div>
            <div className='flex justify-center items-center gap-2'>
            
            </div>
        </>
    )
}