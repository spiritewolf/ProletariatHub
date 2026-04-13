# Setting Up Your First Home Media Server

Disclaimers first! I'm writing this guide due to the many inquiries on how to acheiev my setup from my previous post. I myself am still new to the self hosting community so if any seasoned self hosters have any adjustments they'd make, we should heed their advice. I've tried to make this guide as beginner friendly as possible, but I should be clear that I myself am in tech and write code for a living. So if anything isn't straight forward, I genuinely apologize.

I reallyyy hope this guide is helpful, I will try to answer questions but some things you'll have to decide for yourself (thats also the fun part). I'm going to be suggesting one method for this server setup, I did not use Proxmox, for example, and don't know much about it so I will not be providing instructions on how to set it up LOL.

Also, **please make sure to tip the devs** through whatever methods they have listed on their repos/websites/etc, they've worked really hard so you have access to their software for free and if you're unable to become a contributor this is the best way to give back!

And lastly. I do not condone illegal activities, nor is this guide intended to instruct anyone on how to do illegal things. My only role here is to tell you how to setup a media server and what stack I personally use, where you source your content from and how you use the services you setup is your business. Support your local artists, musicians, academics, authors, etc.

## Pre-reqs

Recommended knowledge

- Bare minimum of how to use a command line. On OSX it is called your "terminal". Commands differ from OSX to Windows to Linux.
- Bare minimum understanding of Linux, Docker

Recommended Supplies

- A mini PC (used, new, etc). I recommend Beelink, Lenovo, etc. You shouldn't need to spend more than $300 on this.
- At least 1tb of storage
- Keyboard (to plug into your mini pc)
- Monitor (for your mini pc)
- Mouse (mini pc)
- HDMI cables, usb to usbc converters, usb hubs, random tools.
- Laptop or other computer (separate from your server)

Note: You can always add on to your server and storage, but I'd recommend doing something that makes doing this much easier. You'll probably want an enclosure (multiple slots for harddrives). You can use a NAS too. Or you can use external hard drive storage to connect to your mini pc via USB. I recommend an enclosure, thats what I went with it was $60. Also harddrives are expensive.

My personal setup is a Mini PC, a $60 hardware enclosure, and multiple internal hard drives. My Pironman (the tiny looking gaming pc) was just for fun, you don't need two dedicated servers unless you want one. You'll have to follow the instructions for whatever hardware you get on setting this up.

## What We're Building

We are going to build a Plex media server. You can use this server for things like music, e-books, and audiobooks too but for simplicity this will be a streamlined setup that makes accessing and downloading movies and TV shows easy for you + your household.

# Setup

## Part one - setting up your PC

This part is going to assume that you're starting from scratch and do not have anything on whatever mini PC you went with. Some mini PCs come pre-installed with Windows like the Beelink. We will eventually remove that. You can use Windows if you want, but my servers are all linux based and I have very minimal familiarity with Windows. Fedora is the linux distro I went with, it is definitely not the most beginner friendly, these instructions will (generally) work for Ubuntu as well. Again, these instructions are basically a minimal replication of my setup.

Theres a chance you won't need to follow any of these steps! If you want to skip to setting up Plex and the Arr stack, you can skip this section.

1. Choose a version of linux. Note: if you're using a RaspberryPi, you'll probably want to use Raspberry OS. I went with Fedora on my mini pc, based on a friend's recommendation. Literally any version of Linux is generally fine. We will be proceeding with Fedora. If you're not using Fedora, skip this section altogether.

2. Grab a USB drive and install Ventoy onto it `https://www.ventoy.net/en/download.html`

- This is Fedora server. It uses less RAM and is more lightweight.

3. Visit `https://fedoraproject.org/server/download/` and download Fedora. You'll _probably_ want `ARM Arch 64 Fedora Server 43 DVD iso`.

4. Drag and drop the downloaded .iso file into your Ventoy USB. Safely eject the USB.

5. If your PC is turned on, turn it off. If your storage/enclosure/hard drives are connected via USB, disconnect them (we don't need them for this part). Google "how to enter BOOT menu for <your pc make & model>". Its usually just a key like f5 or f7 that you press while your computer is turning on (don't turn it on yet tho).

6. Plug the USB into your Mini PC, now turn it on and tap the hell out of whatever key combo you're supposed to.

7. You should see a boot menu, if your PC was pre-installed w/ Windows it'll be the Windows boot menu. Somewhere on this screen you should see your USB listed or `UEFI`. If you don't, panic. I'm kidding, just google your problem or comment here.

8. Select your USB and hit/click enter. The ventoy menu should should appear with your ISO file in there. Hit enter, this will start the boot process. You should see the Fedora installation screen.

9. If you have another OS pre-installed, you'll probably want to delete it. So, once you see something like the "Installation Destination" you want to select the SSD/Hard Disk (**not** CD/DVD or USB) for your mini PC. For example if you have 500 GB of SSD on your mini PC, you should see something with this listed. Select THIS as the installation destination, not the USB or or external storage. The option you want is to "Reclaim" or "Replace" the pre-installed version.

10. Finish following the installation instructions. It will want to reboot, if it doesn't, then reboot it (in the command line you'll wanna type `sudo reboot` and hit enter). **As soon as your PC starts to turn back on hit DEL**, this will enter BIOS. We want to make sure the boot order is correct (this basically means that we need to tell your PC to boot windows and not whatever was on it before). Every BIOS menu is different, so generally you'll want find "Boot Order"/"Boot Priority" and make sure your Fedora/SSD entry is in position #1. Save and Confirm. Your computer should reboot and go straight into Fedora.

- If you had Windows pre-installed, I would also disbale/remove windows from your Boot Order entirely after you've confirmed successful boot up.

- If you encounter issues here, your best bet is to google your PC verison and what step you're stuck on. Watch through some YouTube videos and read through Reddit threads, you might want to pull your hair out but you'll get there lol.

11. Once you've successfully installed Fedora and booted into it, you'll log in with the account it had you setup. You'll want to first update your system `sudo dnf update -y`, after it finishes run this: `sudo dnf install -y nano htop curl wget git` (these are some useful toold)

12. Enable SSH `sudo systemctl enable --now sshd`
