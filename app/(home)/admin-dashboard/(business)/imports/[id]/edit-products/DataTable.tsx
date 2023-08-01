'use client';
import Icon from '@/components/Icon';
import './edit-product.css'; 
import useLoadingAnimation from '@/utils/hooks/useLoadingAnimation';
import { promises } from 'readline';
import Popup from '@/components/Popup';
import usePopup from '@/utils/hooks/usePopup';
import { Button } from '@/layouts/DashboardHeader';
import { Color } from '@/utils/constants/colors';
import { deleteImportOrderDetail } from '@/api/importOrderDetail';

export interface IDetailData {
    [key: string]: string | number,
    productId: number,
    product: string,
    quantity: string,
    price: string,
    totalPrice: string,
}

export default function DataTable({
    dataset, 
    handleChangeSelected,
    handleDelete,
}: {
    dataset: IDetailData[], 
    handleChangeSelected: (id: number) => void,
    handleDelete: (id: number) => void,
}) {  
    const [showLoading, hideLoading] = useLoadingAnimation();
    const popup = usePopup();

    const indexReader = [
        {id: 0, key: "product"},
        {id: 1, key: "quantity"},
        {id: 2, key: "price"},
        {id: 3, key: "totalPrice"}, 
    ];  

    return (
        <table className="flex flex-col gap-2 h-full overflow-auto ">
            <thead>
                <tr className="flex-shrink-0 table-layout h-11 rounded-t-md overflow-hidden font-semibold text-white">
                    {headers.map(header => (
                        <th key={header.id + ""} className="grid place-items-center bg-gray-700 hover:bg-gray-600">{header.text}</th>
                    ))}
                </tr>
            </thead>
            <tbody className='flex flex-col h-full max-h-[580px] bg-gray-50 overflow-auto'>
            {
                dataset.map(detail => (
                    <tr 
                        key={detail.product}
                        className='flex-shrink-0 table-layout h-12  border-2 border-transparent  even:bg-white  hover:border-gray-400 hover:bg-gray-100'
                    > 
                        {indexReader.map((item) => (
                            <td key={detail.product + item.id + ""} className='grid place-items-center'>{detail[item.key]}</td>
                        ))}
                        <td className='flex justify-center items-center gap-2'>
                            <button 
                                className='grid place-items-center h-10 w-10 text-white bg-green rounded-md shadow-lg hover:scale-90 transition-transform'
                                onClick={() => handleChangeSelected(detail.productId)}
                            >
                                <Icon name='pencil' size='lg' />
                            </button>
                            <button
                                className='grid place-items-center h-10 w-10 text-white bg-red rounded-md shadow-lg hover:scale-90 transition-transform'
                                onClick={() => {popup.show(
                                    <ConfirmPopup 
                                        handleDelete={() => {
                                            handleDelete(detail.productId);
                                            popup.hide();
                                        }}
                                        handleCancel={() => popup.hide()}
                                    />
                                )}}
                            >
                                <Icon name='trash' size='lg' />
                            </button>
                        </td>
                    </tr>
                )) 
            }  
            </tbody>
        </table>
    )
} 

const ConfirmPopup = ({
    handleDelete,
    handleCancel,
}: {
    handleDelete: () => void,
    handleCancel: () => void,
}) => {
    return (
        <Popup text='Do you really want to delete this product out of order?'>
            <Button
                bgColor={Color.RED}
                color={Color.WHITE}
                text='Remove'
                actionHandler={handleDelete}
            />
            <Button
                bgColor={Color.WHITE}
                color={Color.BLACK}
                text='Cancel'
                actionHandler={handleCancel}
            />
        </Popup>
    )
} 

const headers = [
    {id: 0, text: "Product"},
    {id: 1, text: "Quantity"},
    {id: 2, text: "Price"},
    {id: 3, text: "Total Price"},
    {id: 4, text: "Action"},
]
 