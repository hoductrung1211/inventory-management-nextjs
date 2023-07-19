'use client';
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table, { ColType } from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
    }, []);
    
    return (
        <section className="w-full flex flex-col">
            <Header>
                <Button 
                    text="Add User"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => {}}
                />
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-2 h-10">
                        <SearchInput
                            placeholder="Type username here..."
                            value=""
                            handleChange={() => {}}
                        />
                    </section>
                    <Table
                        columns={[
                            {id: 1, text: "Username", key: "username", linkRoot: "users/"},
                            {id: 2, text: "Full name", key: "fullname"},
                            {id: 3, text: "Password", key: "password"},
                            {id: 4, text: "Branch", key: "branch"},
                            {id: 5, text: "Role", key: "role"},
                        ]}
                        dataSet={[
                            {username: "hoductrung", fullname: "Ho Duc Trung", password: "123456", branch: "Mien Nam", role: "Super Admin"},
                            {username: "nguyendangbac", fullname: "Nguyen Dang Bac", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "dinhtruongson", fullname: "Dinh Truong Son", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                            {username: "nguyenngocduc", fullname: "Nguyen Ngoc Duc", password: "123456", branch: "Mien Nam", role: "Staff"},
                        ]}
                    />
                </div>
            </Main>
        </section>
    )
}