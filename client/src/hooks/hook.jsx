import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const useError = (errors = []) => {
    useEffect(() => {
        errors?.forEach(({ isError, error, fallback }) => {
            if (isError) {
                if (fallback) fallback()
                else toast.error(error?.data?.message)
            }
        })
    }, [errors])
}

const useAsyncMutation = (mutationHook) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)
    const [mutate] = mutationHook()

    const executeMutation = async (toastMessage, ...args) => {
        setIsLoading(true)
        const toastId = toast.loading(toastMessage || "Updating data...")


        try {
            const result = await mutate(...args)

            if (result.data) {
                toast.update(toastId, {
                    render: result?.data?.message || "Updated data successfully...",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
                setData(result.data)
            } else {
                toast.update(toastId, {
                    render: result?.error?.data?.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 2000
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                id: toastId
            })
        } finally {
            setIsLoading(false)
        }
    }
    return [executeMutation, isLoading, data]
}

const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event, handler)
        })

        return () => {
            Object.entries(handlers).forEach(([event, handler]) => {
                socket.off(event, handler)
            })
        }
    }, [socket, handlers])
}

export { useAsyncMutation, useError, useSocketEvents }
