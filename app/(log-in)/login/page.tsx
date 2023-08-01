'use client';
import Form, { Button, Input } from "../Form";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {adminUrls} from "@/utils/constants/urls";
import ImageGroup from "../ImageGroup";

import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { login } from "@/api/auth";
import axios, { AxiosError } from "axios";

export default function Page() { 
    const router = useRouter();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [credentials, setCredentials] = useState({
        username: 'hoductrung',
        password: '123456',
    });
    const [errors, setErrors] = useState<{username: false | string, password: false | string}>({
        username: false,
        password: false,
    });

    async function handleLogin(e: FormEvent) {
        e.preventDefault();

        try {
            showLoading();
            const { data } = await login(credentials.username, credentials.password);
            localStorage.setItem("token", data);
            router.push(adminUrls.Home);
        } 
        catch(error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
            }
        }
        finally {
            hideLoading();
        }
    }

    return (
        <>
            <ImageGroup
                srcs={["/images/staff-log-in-2.jpg", "/images/staff-log-in-1.jpg"]}
            />
            <Form
                src="/vendors/welcome.svg"
                title="Login Staff Account"
                handleSubmitForm={handleLogin}
            >
                <Input
                    icon="user"
                    label="Identifier"
                    placeholder="N19DCCN001"
                    error={errors.username}
                    value={credentials.username}
                    handleChangeInput={e => setCredentials({...credentials, username: e.target.value})}
                />
                <Input
                    icon="key"
                    label="Password"
                    placeholder="Your password"
                    type="password"
                    error={errors.password}
                    value={credentials.password}
                    handleChangeInput={e => setCredentials({...credentials, password: e.target.value})}
                />
                <Button text="Log in" />
            </Form> 
        </>
    )
}