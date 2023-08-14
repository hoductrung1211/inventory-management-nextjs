'use client';
import { IBranchResponse, getAllBranches } from "@/api/branch";
import { IEmployeeResponse, getAllEmployees } from "@/api/employee";
import { GetAllRoles } from "@/api/role";
import { GetAllUsers } from "@/api/user";
import PageTitle from "@/components/PageTitle";
import SearchInput from "@/components/SearchInput";
import Header  from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IUserData {
    username: string,
    password: string,
    employeeId: number,
    employee: string,
    role: string,
}

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();

    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState<IUserData[]>([]);
    const [filterdUsers, setFilteredUsers] = useState<IItem[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            showLoading(); 
            const {data} = await GetAllUsers();
            const {data : roleData} = await GetAllRoles();
            const {data: eeData} = await getAllEmployees();

            const newUsers: IUserData[] = data.map(user => {
                const employee = eeData.find(ee => ee.id === user.employeeId);
                const eeName = employee ? employee.lastName + " " + employee.firstName : "";
                const role = roleData.find(r => r.id === user.roleId);

                return {
                    username: user.username,
                    password: user.password,
                    employeeId: user.employeeId,
                    employee: eeName,
                    role: role ? role?.name : "",
                }
            })
            setUsers(newUsers);
            setFilteredUsers(toIndexSignature(newUsers));
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
                <PageTitle text="User List" /> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type Username here..."
                            value={searchValue}
                            handleChange={e => {
                                const newSearchValue = e.target.value;
                                setSearchValue(newSearchValue);
                                const filterList = filterByFields(
                                        toIndexSignature(users), 
                                        newSearchValue.trim(), 
                                        ["username", "employeeId"]
                                    );
                                setFilteredUsers(filterList);
                            }}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Username", key: "username", linkRoot: "users/"},
                            {id: 2, text: "Employee Id", key: "employeeId", linkRoot: "employees/"},
                            {id: 3, text: "Employee", key: "employee"},
                            {id: 4, text: "Role", key: "role"},
                        ]}
                        dataSet={filterdUsers}
                    />
                </div>
            </Main>
        </section>
    )
}