import { useParams } from "react-router-dom";
import { MoreActionsInterface } from "./Collections";
import GETRequest from "../../../../setting/Request";
import { TranslationsKeys } from "../../../../setting/Types";

export const useActions = () => {
    const { lang = 'ru' } = useParams<{ lang: string }>();
    const { data: translation } = GETRequest<TranslationsKeys>(
        `/translates`,
        'translates',
        [lang],
    );

    const defaultMoreActions: MoreActionsInterface[] = [
        {
            id: 1,
            title: translation?.kolleksiyaya_bax_key || "Посмотреть коллекцию",
            icon: "/Eye.svg",
        },
        {
            id: 2,
            title: translation?.redakte_et_key || "Редактировать",
            icon: "/peng.svg",
        },
        {
            id: 3,
            title: translation?.sill_key || "Удалить",
            icon: "/removed.svg",
        },
    ];

    return { defaultMoreActions }
}