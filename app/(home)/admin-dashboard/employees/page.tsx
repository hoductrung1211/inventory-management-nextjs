'use client';
import { getAllBranches } from "@/api/branch";
import { getAllEmployees } from "@/api/employee";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";
import SearchInput from "@/components/SearchInput";
import Header from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IEmployeeData {
    id: number,
    name: string,
    gender: string,
    dateOfBirth: string,
    email: string,
    branch: string,
    manager: string,
}

export default function Page() {
    const router = useRouter();
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [searchValue, setSearchValue] = useState("");
    const [employees, setEmployees] = useState<IEmployeeData[]>([]);
    const [filterdEmployees, setFilteredEmployees] = useState<IItem[]>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            showLoading(); 
            const {data} = await getAllEmployees();
            const {data : brData} = await getAllBranches();

            const newEEs: IEmployeeData[] = data.map(ee => {
                const branch = brData.find(br => br.id === ee.branchId);
                const mngr = data.find(emp => emp.id === ee.managerId);
                const mngrName = mngr ? mngr.lastName + " " + mngr.firstName : ""
                return {
                    id: ee.id,
                    name: ee.lastName + " " + ee.firstName,
                    gender: ee.gender ? "Male" : "Female",
                    dateOfBirth: ee.dateOfBirth ?? "",
                    email: ee.email,
                    branch: branch?.name ?? "",
                    manager: mngrName
                }
            })
            setEmployees(newEEs);
            setFilteredEmployees(toIndexSignature(newEEs));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <PageTitle text="Employee List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex justify-between gap-2 h-10">
                        <SearchInput
                            placeholder="Type Employee ID here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(employees), 
                                        newSearchValue.trim(), 
                                        ["id"]
                                    );
                                setFilteredEmployees(filterList);
                            }}
                        />
                        <Button
                            variant="outlined"
                            icon="square-plus" 
                            href="employees/add"
                        >
                            Add
                        </Button>
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Id", key: "id", linkRoot: "employees/"},
                            {id: 2, text: "Full Name", key: "name"},
                            {id: 5, text: "Email", key: "email"},
                            {id: 6, text: "Branch", key: "branch"},
                            {id: 7, text: "Manager", key: "manager"},
                        ]}
                        dataSet={filterdEmployees}
                    />
                </div>
            </Main>
        </section>
    )
}